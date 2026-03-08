import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/SectionComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import {
  Users, FileText, MessageSquare, GraduationCap, BookOpen, Mail,
  Check, X, Plus, Trash2
} from "lucide-react";

type Tab = "overview" | "applications" | "cohorts" | "students" | "blog" | "messages";

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (loading) return <Layout><Section><p>Loading...</p></Section></Layout>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "applications", label: "Applications", icon: GraduationCap },
    { id: "cohorts", label: "Cohorts", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "messages", label: "Messages", icon: Mail },
  ];

  return (
    <Layout>
      <Section>
        <h1 className="font-display text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "overview" && <OverviewPanel />}
        {activeTab === "applications" && <ApplicationsPanel />}
        {activeTab === "cohorts" && <CohortsPanel />}
        {activeTab === "students" && <StudentsPanel />}
        {activeTab === "blog" && <BlogPanel />}
        {activeTab === "messages" && <MessagesPanel />}
      </Section>
    </Layout>
  );
}

function OverviewPanel() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchStats = async () => {
      const [apps, students, cohorts, messages, blogs] = await Promise.all([
        supabase.from("dss_applications").select("id", { count: "exact", head: true }),
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("cohorts").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        applications: apps.count ?? 0,
        students: students.count ?? 0,
        cohorts: cohorts.count ?? 0,
        messages: messages.count ?? 0,
        blogs: blogs.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "DSS Applications", value: stats.applications ?? 0, icon: GraduationCap },
    { label: "Students", value: stats.students ?? 0, icon: Users },
    { label: "Cohorts", value: stats.cohorts ?? 0, icon: BookOpen },
    { label: "Blog Posts", value: stats.blogs ?? 0, icon: FileText },
    { label: "Contact Messages", value: stats.messages ?? 0, icon: Mail },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <card.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">{card.label}</span>
          </div>
          <div className="font-display text-3xl font-bold">{card.value}</div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsPanel() {
  const [apps, setApps] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("dss_applications").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setApps(data);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("dss_applications").update({ status }).eq("id", id);
    if (!error) {
      setApps(apps.map(a => a.id === id ? { ...a, status } : a));
      toast({ title: `Application ${status}` });
    }
  };

  return (
    <div className="space-y-4">
      {apps.length === 0 && <p className="text-muted-foreground">No applications yet.</p>}
      {apps.map((app) => (
        <div key={app.id} className="bg-card rounded-xl p-6 border border-border">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{app.name}</h3>
              <p className="text-sm text-muted-foreground">{app.email} · {app.phone} · {app.city}</p>
              <p className="text-sm text-muted-foreground">Age: {app.age} · Education: {app.education} · Interest: {app.skill_interest}</p>
              <p className="text-sm mt-2">{app.motivation}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                app.status === "approved" ? "bg-success/20 text-success" :
                app.status === "rejected" ? "bg-destructive/20 text-destructive" :
                "bg-warning/20 text-warning"
              }`}>
                {app.status}
              </span>
              {app.status === "pending" && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, "approved")}>
                    <Check className="h-4 w-4 text-success" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, "rejected")}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CohortsPanel() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [desc, setDesc] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("cohorts").select("*").order("year", { ascending: false }).then(({ data }) => {
      if (data) setCohorts(data);
    });
  }, []);

  const addCohort = async () => {
    if (!name) return;
    const { data, error } = await supabase.from("cohorts").insert({ name, year, description: desc }).select().single();
    if (data) {
      setCohorts([data, ...cohorts]);
      setName(""); setDesc("");
      toast({ title: "Cohort created" });
    }
  };

  const deleteCohort = async (id: string) => {
    await supabase.from("cohorts").delete().eq("id", id);
    setCohorts(cohorts.filter(c => c.id !== id));
    toast({ title: "Cohort deleted" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">Add Cohort</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Cohort name" value={name} onChange={e => setName(e.target.value)} />
          <Input type="number" placeholder="Year" value={year} onChange={e => setYear(parseInt(e.target.value))} />
          <Input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <Button onClick={addCohort} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Cohort</Button>
      </div>
      {cohorts.map(c => (
        <div key={c.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{c.name}</h4>
            <p className="text-sm text-muted-foreground">{c.year} · {c.description}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => deleteCohort(c.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function StudentsPanel() {
  const [students, setStudents] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [skill, setSkill] = useState("");
  const [cohortId, setCohortId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("students").select("*, cohorts(name)").then(({ data }) => { if (data) setStudents(data); });
    supabase.from("cohorts").select("*").then(({ data }) => { if (data) setCohorts(data); });
  }, []);

  const addStudent = async () => {
    if (!name) return;
    const { data, error } = await supabase.from("students").insert({
      name, city, skill, cohort_id: cohortId || null,
    }).select("*, cohorts(name)").single();
    if (data) {
      setStudents([data, ...students]);
      setName(""); setCity(""); setSkill(""); setCohortId("");
      toast({ title: "Student added" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">Add Student</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
          <Input placeholder="Skill" value={skill} onChange={e => setSkill(e.target.value)} />
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={cohortId}
            onChange={e => setCohortId(e.target.value)}
          >
            <option value="">Select Cohort</option>
            {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <Button onClick={addStudent} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Student</Button>
      </div>
      <div className="grid gap-3">
        {students.map(s => (
          <div key={s.id} className="bg-card rounded-xl p-4 border border-border">
            <h4 className="font-semibold">{s.name}</h4>
            <p className="text-sm text-muted-foreground">{s.city} · {s.skill} · {s.cohorts?.name ?? "No cohort"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogPanel() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setPosts(data);
    });
  }, []);

  const addPost = async () => {
    if (!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data, error } = await supabase.from("blog_posts").insert({ title, slug, content, category }).select().single();
    if (data) {
      setPosts([data, ...posts]);
      setTitle(""); setContent(""); setCategory("");
      toast({ title: "Post created" });
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const deletePost = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    setPosts(posts.filter(p => p.id !== id));
    toast({ title: "Post deleted" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">Create Blog Post</h3>
        <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <Textarea placeholder="Content..." value={content} onChange={e => setContent(e.target.value)} rows={6} />
        <Button onClick={addPost} size="sm"><Plus className="h-4 w-4 mr-1" /> Publish Post</Button>
      </div>
      {posts.map(p => (
        <div key={p.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{p.title}</h4>
            <p className="text-sm text-muted-foreground">{p.category} · {new Date(p.created_at).toLocaleDateString()}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => deletePost(p.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function MessagesPanel() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setMessages(data);
    });
  }, []);

  return (
    <div className="space-y-4">
      {messages.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
      {messages.map(m => (
        <div key={m.id} className="bg-card rounded-xl p-6 border border-border">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{m.subject}</h3>
            <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">From: {m.name} ({m.email})</p>
          <p className="text-sm">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

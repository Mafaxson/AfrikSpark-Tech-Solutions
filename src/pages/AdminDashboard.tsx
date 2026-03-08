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
  Check, X, Plus, Trash2, Edit, Star, UserCheck, Link as LinkIcon, Save
} from "lucide-react";

type Tab = "overview" | "applications" | "cohorts" | "students" | "blog" | "messages" | "testimonies" | "community" | "settings";

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
    { id: "testimonies", label: "Testimonies", icon: Star },
    { id: "community", label: "Community", icon: UserCheck },
    { id: "settings", label: "Settings", icon: LinkIcon },
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
        {activeTab === "testimonies" && <TestimoniesPanel />}
        {activeTab === "community" && <CommunityPanel />}
        {activeTab === "settings" && <SettingsPanel />}
      </Section>
    </Layout>
  );
}

function OverviewPanel() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchStats = async () => {
      const [apps, students, cohorts, messages, blogs, testimonies, pending] = await Promise.all([
        supabase.from("dss_applications").select("id", { count: "exact", head: true }),
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("cohorts").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("testimonies").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approved", false),
      ]);
      setStats({
        applications: apps.count ?? 0,
        students: students.count ?? 0,
        cohorts: cohorts.count ?? 0,
        messages: messages.count ?? 0,
        blogs: blogs.count ?? 0,
        testimonies: testimonies.count ?? 0,
        pendingApprovals: pending.count ?? 0,
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
    { label: "Testimonies", value: stats.testimonies ?? 0, icon: Star },
    { label: "Pending Approvals", value: stats.pendingApprovals ?? 0, icon: UserCheck },
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
                app.status === "approved" ? "bg-green-100 text-green-700" :
                app.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {app.status}
              </span>
              {app.status === "pending" && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, "approved")}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, "rejected")}>
                    <X className="h-4 w-4 text-red-600" />
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

function TestimoniesPanel() {
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [testimony, setTestimony] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTestimonies = () => {
    supabase.from("testimonies").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setTestimonies(data);
    });
  };

  useEffect(() => { fetchTestimonies(); }, []);

  const resetForm = () => {
    setName(""); setContact(""); setTestimony(""); setImageUrl(""); setVideoUrl("");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!name || !testimony) return;
    const payload = { name, contact: contact || null, testimony, image_url: imageUrl || null, video_url: videoUrl || null, approved: true };

    if (editingId) {
      const { error } = await supabase.from("testimonies").update(payload).eq("id", editingId);
      if (!error) { toast({ title: "Testimony updated" }); resetForm(); fetchTestimonies(); }
    } else {
      const { error } = await supabase.from("testimonies").insert(payload);
      if (!error) { toast({ title: "Testimony added" }); resetForm(); fetchTestimonies(); }
    }
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setName(t.name);
    setContact(t.contact || "");
    setTestimony(t.testimony);
    setImageUrl(t.image_url || "");
    setVideoUrl(t.video_url || "");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("testimonies").delete().eq("id", id);
    toast({ title: "Testimony deleted" });
    fetchTestimonies();
  };

  const toggleApproval = async (id: string, current: boolean) => {
    await supabase.from("testimonies").update({ approved: !current }).eq("id", id);
    toast({ title: current ? "Testimony hidden" : "Testimony approved" });
    fetchTestimonies();
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">{editingId ? "Edit Testimony" : "Add Testimony"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Person's name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Contact (email/phone)" value={contact} onChange={e => setContact(e.target.value)} />
          <Input placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          <Input placeholder="Video URL (optional)" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
        </div>
        <Textarea placeholder="Testimony text..." value={testimony} onChange={e => setTestimony(e.target.value)} rows={4} />
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            {editingId ? <><Save className="h-4 w-4 mr-1" /> Update</> : <><Plus className="h-4 w-4 mr-1" /> Add Testimony</>}
          </Button>
          {editingId && <Button variant="outline" size="sm" onClick={resetForm}>Cancel</Button>}
        </div>
      </div>

      {testimonies.map(t => (
        <div key={t.id} className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{t.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded ${t.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {t.approved ? "Published" : "Pending"}
                </span>
              </div>
              {t.contact && <p className="text-xs text-muted-foreground mb-1">{t.contact}</p>}
              <p className="text-sm text-muted-foreground line-clamp-2">{t.testimony}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => toggleApproval(t.id, t.approved)}>
                {t.approved ? <X className="h-4 w-4 text-yellow-600" /> : <Check className="h-4 w-4 text-green-600" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => startEdit(t)}>
                <Edit className="h-4 w-4 text-primary" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommunityPanel() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setProfiles(data);
    });
  }, []);

  const toggleApproval = async (userId: string, currentApproved: boolean) => {
    const { error } = await supabase.from("profiles").update({ approved: !currentApproved }).eq("user_id", userId);
    if (!error) {
      setProfiles(profiles.map(p => p.user_id === userId ? { ...p, approved: !currentApproved } : p));
      toast({ title: currentApproved ? "User access revoked" : "User approved for community" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm text-muted-foreground">
          Approve or revoke community access for registered users. Approved users can access channels, DMs, and the opportunity board.
        </p>
      </div>
      {profiles.length === 0 && <p className="text-muted-foreground">No registered users yet.</p>}
      {profiles.map(p => (
        <div key={p.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{p.display_name || "Unnamed User"}</h4>
            <p className="text-xs text-muted-foreground">User ID: {p.user_id.slice(0, 8)}... · Joined: {new Date(p.created_at).toLocaleDateString()}</p>
          </div>
          <Button
            size="sm"
            variant={p.approved ? "outline" : "default"}
            onClick={() => toggleApproval(p.user_id, p.approved)}
          >
            {p.approved ? (
              <><X className="h-4 w-4 mr-1" /> Revoke</>
            ) : (
              <><Check className="h-4 w-4 mr-1" /> Approve</>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel() {
  const [applicationLink, setApplicationLink] = useState("");
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("key", "dss_application_link").single().then(({ data }) => {
      if (data) setApplicationLink(data.value || "");
    });
  }, []);

  const saveLink = async () => {
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", "dss_application_link").single();
    if (existing) {
      await supabase.from("site_settings").update({ value: applicationLink }).eq("key", "dss_application_link");
    } else {
      await supabase.from("site_settings").insert({ key: "dss_application_link", value: applicationLink });
    }
    toast({ title: "Application link saved" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">DSS Application Form Link</h3>
        <p className="text-sm text-muted-foreground">
          Set the external application form URL. This is where applicants will be redirected to apply and pay the LE 250 fee.
        </p>
        <Input
          placeholder="https://forms.google.com/... or any external form link"
          value={applicationLink}
          onChange={e => setApplicationLink(e.target.value)}
        />
        <Button onClick={saveLink} size="sm">
          <Save className="h-4 w-4 mr-1" /> {saved ? "Saved!" : "Save Link"}
        </Button>
      </div>
    </div>
  );
}

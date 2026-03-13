import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/SectionComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BlogManagement } from "@/components/admin/BlogManagement";
import { TestimonialManagement } from "@/components/admin/TestimonialManagement";
import {
  Users, FileText, MessageSquare, GraduationCap, BookOpen, Mail,
  Check, X, Plus, Trash2, Edit, Star, UserCheck, Link as LinkIcon, Save,
  Hash, Megaphone, Calendar, FolderOpen, Shield, Bell
} from "lucide-react";

type Tab = "overview" | "applications" | "cohorts" | "students" | "blog" | "messages" | "testimonies" | "community" | "channels" | "events" | "resources" | "settings" | "partners" | "sponsors";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (loading) return <Layout><Section><p>Loading...</p></Section></Layout>;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "applications", label: "Applications", icon: GraduationCap },
    { id: "cohorts", label: "Cohorts", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "testimonies", label: "Testimonies", icon: Star },
    { id: "partners", label: "Partners", icon: Shield },
    { id: "sponsors", label: "Sponsors", icon: Bell },
    { id: "community", label: "Members", icon: UserCheck },
    { id: "channels", label: "Channels", icon: Hash },
    { id: "events", label: "Events", icon: Calendar },
    { id: "resources", label: "Resources", icon: FolderOpen },
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
        {activeTab === "partners" && <PartnersPanel />}
        {activeTab === "sponsors" && <SponsorsPanel />}
        {activeTab === "community" && <CommunityPanel />}
        {activeTab === "channels" && <ChannelsPanel />}
        {activeTab === "events" && <EventsPanel />}
        {activeTab === "resources" && <ResourcesPanel />}
        {activeTab === "settings" && <SettingsPanel />}
      </Section>
    </Layout>
  );
}

// ===== OVERVIEW =====
function OverviewPanel() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apps, students, cohorts, messages, blogs, testimonies, pending, channels, events, resources] = await Promise.all([
          supabase.from("dss_applications").select("id", { count: "exact", head: true }),
          supabase.from("students").select("id", { count: "exact", head: true }),
          supabase.from("cohorts").select("id", { count: "exact", head: true }),
          supabase.from("contact_messages").select("id", { count: "exact", head: true }),
          supabase.from("blog_posts").select("id", { count: "exact", head: true }),
          supabase.from("testimonies").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approved", false),
          supabase.from("channels").select("id", { count: "exact", head: true }),
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("resources").select("id", { count: "exact", head: true }),
        ]);
        setStats({
          applications: apps.count ?? 0, students: students.count ?? 0, cohorts: cohorts.count ?? 0,
          messages: messages.count ?? 0, blogs: blogs.count ?? 0, testimonies: testimonies.count ?? 0,
          pendingApprovals: pending.count ?? 0, channels: channels.count ?? 0, events: events.count ?? 0,
          resources: resources.count ?? 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
            </div>
            <div className="h-8 bg-muted rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "DSS Applications", value: stats.applications ?? 0, icon: GraduationCap },
    { label: "Students", value: stats.students ?? 0, icon: Users },
    { label: "Cohorts", value: stats.cohorts ?? 0, icon: BookOpen },
    { label: "Channels", value: stats.channels ?? 0, icon: Hash },
    { label: "Events", value: stats.events ?? 0, icon: Calendar },
    { label: "Resources", value: stats.resources ?? 0, icon: FolderOpen },
    { label: "Blog Posts", value: stats.blogs ?? 0, icon: FileText },
    { label: "Contact Messages", value: stats.messages ?? 0, icon: Mail },
    { label: "Testimonies", value: stats.testimonies ?? 0, icon: Star },
    { label: "Pending Approvals", value: stats.pendingApprovals ?? 0, icon: UserCheck },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

// ===== APPLICATIONS =====
function ApplicationsPanel() {
  const [apps, setApps] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    supabase.from("dss_applications").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setApps(data); });
  }, []);
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("dss_applications").update({ status }).eq("id", id);
    if (!error) { setApps(apps.map(a => a.id === id ? { ...a, status } : a)); toast({ title: `Application ${status}` }); }
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
              <span className={`text-xs font-medium px-2 py-1 rounded ${app.status === "approved" ? "bg-green-100 text-green-700" : app.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{app.status}</span>
              {app.status === "pending" && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, "approved")}><Check className="h-4 w-4 text-green-600" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, "rejected")}><X className="h-4 w-4 text-destructive" /></Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== COHORTS =====
function CohortsPanel() {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [name, setName] = useState(""); const [year, setYear] = useState(new Date().getFullYear()); const [desc, setDesc] = useState("");
  const { toast } = useToast();
  useEffect(() => { supabase.from("cohorts").select("*").order("year", { ascending: false }).then(({ data }) => { if (data) setCohorts(data); }); }, []);
  const addCohort = async () => {
    if (!name) return;
    const { data } = await supabase.from("cohorts").insert({ name, year, description: desc }).select().single();
    if (data) { setCohorts([data, ...cohorts]); setName(""); setDesc(""); toast({ title: "Cohort created" }); }
  };
  const deleteCohort = async (id: string) => { await supabase.from("cohorts").delete().eq("id", id); setCohorts(cohorts.filter(c => c.id !== id)); toast({ title: "Cohort deleted" }); };
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
          <div><h4 className="font-semibold">{c.name}</h4><p className="text-sm text-muted-foreground">{c.year} · {c.description}</p></div>
          <Button size="sm" variant="ghost" onClick={() => deleteCohort(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
    </div>
  );
}

// ===== STUDENTS =====
function StudentsPanel() {
  const [students, setStudents] = useState<any[]>([]); const [cohorts, setCohorts] = useState<any[]>([]);
  const [name, setName] = useState(""); const [city, setCity] = useState(""); const [skill, setSkill] = useState(""); const [cohortId, setCohortId] = useState("");
  const { toast } = useToast();
  useEffect(() => {
    supabase.from("students").select("*, cohorts(name)").then(({ data }) => { if (data) setStudents(data); });
    supabase.from("cohorts").select("*").then(({ data }) => { if (data) setCohorts(data); });
  }, []);
  const addStudent = async () => {
    if (!name) return;
    const { data } = await supabase.from("students").insert({ name, city, skill, cohort_id: cohortId || null }).select("*, cohorts(name)").single();
    if (data) { setStudents([data, ...students]); setName(""); setCity(""); setSkill(""); setCohortId(""); toast({ title: "Student added" }); }
  };
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">Add Student</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
          <Input placeholder="Skill" value={skill} onChange={e => setSkill(e.target.value)} />
          <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={cohortId} onChange={e => setCohortId(e.target.value)}>
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

// ===== BLOG =====
function BlogPanel() {
  return <BlogManagement />;
}

// ===== MESSAGES =====
function MessagesPanel() {
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => { supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setMessages(data); }); }, []);
  return (
    <div className="space-y-4">
      {messages.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
      {messages.map(m => (
        <div key={m.id} className="bg-card rounded-xl p-6 border border-border">
          <div className="flex justify-between items-start mb-2"><h3 className="font-semibold">{m.subject}</h3><span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span></div>
          <p className="text-sm text-muted-foreground mb-2">From: {m.name} ({m.email})</p>
          <p className="text-sm">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

// ===== TESTIMONIES =====
function TestimoniesPanel() {
  return <TestimonialManagement />;
}

// ===== COMMUNITY (Member Approvals) =====
function CommunityPanel() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => { supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setProfiles(data); }); }, []);
  const toggleApproval = async (userId: string, currentApproved: boolean) => {
    const { error } = await supabase.from("profiles").update({ approved: !currentApproved }).eq("user_id", userId);
    if (!error) { setProfiles(profiles.map(p => p.user_id === userId ? { ...p, approved: !currentApproved } : p)); toast({ title: currentApproved ? "User access revoked" : "User approved for community" }); }
  };
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-sm text-muted-foreground">Approve or revoke community access for registered users.</p>
      </div>
      {profiles.length === 0 && <p className="text-muted-foreground">No registered users yet.</p>}
      {profiles.map(p => (
        <div key={p.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{p.display_name || "Unnamed User"}</h4>
            <p className="text-xs text-muted-foreground">Joined: {new Date(p.created_at).toLocaleDateString()}</p>
          </div>
          <Button size="sm" variant={p.approved ? "outline" : "default"} onClick={() => toggleApproval(p.user_id, p.approved)}>
            {p.approved ? <><X className="h-4 w-4 mr-1" /> Revoke</> : <><Check className="h-4 w-4 mr-1" /> Approve</>}
          </Button>
        </div>
      ))}
    </div>
  );
}

// ===== CHANNELS =====
function ChannelsPanel() {
  const [channels, setChannels] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [name, setName] = useState(""); const [desc, setDesc] = useState("");
  const [type, setType] = useState("general"); const [cohortId, setCohortId] = useState("");
  const [channelAdmins, setChannelAdmins] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [adminUserId, setAdminUserId] = useState("");
  const { toast } = useToast();

  const fetchChannels = async () => {
    const { data } = await supabase.from("channels").select("*, cohorts(name)").order("type").order("name");
    if (data) setChannels(data);
    const { data: admins } = await supabase.from("channel_admins").select("*");
    if (admins) setChannelAdmins(admins);
  };

  useEffect(() => {
    fetchChannels();
    supabase.from("cohorts").select("*").order("year", { ascending: false }).then(({ data }) => { if (data) setCohorts(data); });
    supabase.from("profiles").select("user_id, display_name").eq("approved", true).then(({ data }) => { if (data) setProfiles(data); });
  }, []);

  const addChannel = async () => {
    if (!name) return;
    const { error } = await supabase.from("channels").insert({
      name, description: desc || null, type,
      cohort_id: type === "class" ? cohortId || null : null,
      is_admin_only: type === "announcement",
    });
    if (!error) { toast({ title: "Channel created" }); setName(""); setDesc(""); fetchChannels(); }
    else toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const deleteChannel = async (id: string) => {
    await supabase.from("channels").delete().eq("id", id);
    toast({ title: "Channel deleted" });
    fetchChannels();
  };

  const addChannelAdmin = async () => {
    if (!selectedChannel || !adminUserId) return;
    const { error } = await supabase.from("channel_admins").insert({ channel_id: selectedChannel, user_id: adminUserId });
    if (!error) { toast({ title: "Class admin assigned" }); setAdminUserId(""); fetchChannels(); }
    else toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const removeChannelAdmin = async (id: string) => {
    await supabase.from("channel_admins").delete().eq("id", id);
    toast({ title: "Admin removed" });
    fetchChannels();
  };

  const getChannelAdmins = (channelId: string) => channelAdmins.filter(a => a.channel_id === channelId);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">Create Channel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Channel name" value={name} onChange={e => setName(e.target.value)} />
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={type} onChange={e => setType(e.target.value)}>
            <option value="general">General</option>
            <option value="announcement">Announcement (Admin Only)</option>
            <option value="class">Class Channel</option>
          </select>
          {type === "class" && (
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={cohortId} onChange={e => setCohortId(e.target.value)}>
              <option value="">Link to Cohort (optional)</option>
              {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <Input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <Button onClick={addChannel} size="sm"><Plus className="h-4 w-4 mr-1" /> Create Channel</Button>
      </div>

      {/* Channel list */}
      {channels.map(c => (
        <div key={c.id} className={`bg-card rounded-xl p-4 border ${selectedChannel === c.id ? "border-primary" : "border-border"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              {c.type === "announcement" ? <Megaphone className="h-4 w-4 text-primary" /> :
               c.type === "class" ? <BookOpen className="h-4 w-4 text-primary" /> :
               <Hash className="h-4 w-4 text-muted-foreground" />}
              <div>
                <h4 className="font-semibold">{c.name}</h4>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="bg-muted px-1.5 py-0.5 rounded">{c.type}</span>
                  {c.cohorts?.name && <span>{c.cohorts.name}</span>}
                  {c.is_admin_only && <span className="text-primary">Admin Only</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {c.type === "class" && (
                <Button size="sm" variant="outline" onClick={() => setSelectedChannel(selectedChannel === c.id ? null : c.id)}>
                  <Shield className="h-4 w-4 mr-1" /> Admins
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => deleteChannel(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>

          {/* Class admin management */}
          {selectedChannel === c.id && c.type === "class" && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <h5 className="text-sm font-medium">Class Admins</h5>
              {getChannelAdmins(c.id).map(admin => {
                const profile = profiles.find(p => p.user_id === admin.user_id);
                return (
                  <div key={admin.id} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
                    <span className="text-sm">{profile?.display_name ?? admin.user_id.slice(0, 8)}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeChannelAdmin(admin.id)}><X className="h-4 w-4 text-destructive" /></Button>
                  </div>
                );
              })}
              <div className="flex gap-2">
                <select className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm" value={adminUserId} onChange={e => setAdminUserId(e.target.value)}>
                  <option value="">Select member</option>
                  {profiles.map(p => <option key={p.user_id} value={p.user_id}>{p.display_name ?? "User"}</option>)}
                </select>
                <Button size="sm" onClick={addChannelAdmin}><Plus className="h-4 w-4 mr-1" /> Assign</Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== EVENTS =====
function EventsPanel() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", type: "webinar", date: "", location: "", recording_url: "" });
  const { toast } = useToast();
  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: false });
    if (data) setEvents(data);
  };
  useEffect(() => { fetchEvents(); }, []);
  const handleCreate = async () => {
    if (!form.title || !form.date || !user) return;
    await supabase.from("events").insert({ ...form, date: form.date, location: form.location || null, recording_url: form.recording_url || null, created_by: user.id });
    toast({ title: "Event created" });
    setForm({ title: "", description: "", type: "webinar", date: "", location: "", recording_url: "" });
    fetchEvents();
  };
  const deleteEvent = async (id: string) => { await supabase.from("events").delete().eq("id", id); toast({ title: "Event deleted" }); fetchEvents(); };
  const updateRecording = async (id: string, url: string) => { await supabase.from("events").update({ recording_url: url }).eq("id", id); toast({ title: "Recording updated" }); fetchEvents(); };
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">Create Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="webinar">Webinar</option><option value="bootcamp">Bootcamp</option><option value="mentorship">Mentorship</option><option value="workshop">Workshop</option>
          </select>
          <Input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Input placeholder="Location (optional)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        </div>
        <Textarea placeholder="Description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
        <Button onClick={handleCreate} size="sm"><Plus className="h-4 w-4 mr-1" /> Create Event</Button>
      </div>
      {events.map(e => (
        <div key={e.id} className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold">{e.title}</h4>
              <p className="text-sm text-muted-foreground">{e.type} · {new Date(e.date).toLocaleString()} {e.location && `· ${e.location}`}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => deleteEvent(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Input placeholder="Recording URL" defaultValue={e.recording_url || ""} onBlur={ev => { if (ev.target.value !== (e.recording_url || "")) updateRecording(e.id, ev.target.value); }} className="text-xs h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== RESOURCES =====
function ResourcesPanel() {
  const [resources, setResources] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const fetchResources = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    if (data) {
      setResources(data);
      const userIds = [...new Set(data.map(r => r.posted_by))];
      if (userIds.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
        if (profs) { const map: Record<string, any> = {}; profs.forEach(p => { map[p.user_id] = p; }); setProfiles(map); }
      }
    }
  };
  useEffect(() => { fetchResources(); }, []);
  const deleteResource = async (id: string) => { await supabase.from("resources").delete().eq("id", id); toast({ title: "Resource deleted" }); fetchResources(); };
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Manage community resources. Members can also share resources from the community platform.</p>
      {resources.map(r => (
        <div key={r.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{r.title}</h4>
            <p className="text-xs text-muted-foreground">{r.category} · By {profiles[r.posted_by]?.display_name ?? "Member"} · {new Date(r.created_at).toLocaleDateString()}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => deleteResource(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
      {resources.length === 0 && <p className="text-muted-foreground">No resources yet.</p>}
    </div>
  );
}

// ===== BLOG =====
function BlogPanel() {
  return <BlogManagement />;
}

// ===== MESSAGES =====
function MessagesPanel() {
  const [messages, setMessages] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => { supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setMessages(data); }); }, []);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Manage contact form messages.</p>
      {messages.map(m => (
        <div key={m.id} className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold">{m.subject}</h4>
              <p className="text-sm text-muted-foreground">From {m.name} ({m.email})</p>
              <p className="text-sm mt-2">{m.message}</p>
            </div>
          </div>
        </div>
      ))}
      {messages.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
    </div>
  );
}

// ===== TESTIMONIES =====
function TestimoniesPanel() {
  return <TestimonialManagement />;
}

// ===== COMMUNITY =====
function CommunityPanel() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => { supabase.from("profiles").select("*").order("display_name").then(({ data }) => { if (data) setProfiles(data); }); }, []);
  const toggleApproval = async (id: string, approved: boolean) => {
    await supabase.from("profiles").update({ approved }).eq("id", id);
    setProfiles(profiles.map(p => p.id === id ? { ...p, approved } : p));
    toast({ title: `Profile ${approved ? "approved" : "unapproved"}` });
  };
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Manage community member profiles.</p>
      {profiles.map(p => (
        <div key={p.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{p.display_name}</h4>
            <p className="text-sm text-muted-foreground">{p.email}</p>
          </div>
          <Button size="sm" variant={p.approved ? "destructive" : "default"} onClick={() => toggleApproval(p.id, !p.approved)}>
            {p.approved ? "Unapprove" : "Approve"}
          </Button>
        </div>
      ))}
      {profiles.length === 0 && <p className="text-muted-foreground">No profiles yet.</p>}
    </div>
  );
}

// ===== SETTINGS =====
function SettingsPanel() {
  const [applicationLink, setApplicationLink] = useState("");
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  useEffect(() => { supabase.from("site_settings").select("*").eq("key", "dss_application_link").single().then(({ data }) => { if (data) setApplicationLink(data.value || ""); }); }, []);
  const saveLink = async () => {
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", "dss_application_link").single();
    if (existing) await supabase.from("site_settings").update({ value: applicationLink }).eq("key", "dss_application_link");
    else await supabase.from("site_settings").insert({ key: "dss_application_link", value: applicationLink });
    toast({ title: "Application link saved" }); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <h3 className="font-semibold">DSS Application Form Link</h3>
        <p className="text-sm text-muted-foreground">Set the external application form URL. This is where applicants will be redirected to apply and pay the LE 250 fee.</p>
        <Input placeholder="https://forms.google.com/... or any external form link" value={applicationLink} onChange={e => setApplicationLink(e.target.value)} />
        <Button onClick={saveLink} size="sm"><Save className="h-4 w-4 mr-1" /> {saved ? "Saved!" : "Save Link"}</Button>
      </div>
    </div>
  );
}

// ===== CHANNELS =====
function ChannelsPanel() {
  return <div className="text-center py-8 text-muted-foreground">Channels management coming soon.</div>;
}

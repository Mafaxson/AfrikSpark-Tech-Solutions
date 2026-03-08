import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ExternalLink, FileText, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Learning Materials", "Scholarships", "Jobs", "Freelancing", "Collaboration", "Templates & Guides", "Other"];

export function ResourcesHub() {
  const { user, isAdmin } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [link, setLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const { toast } = useToast();

  const fetchResources = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    if (data) {
      setResources(data);
      const userIds = [...new Set(data.map(r => r.posted_by))];
      const { data: profs } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
      if (profs) {
        const map: Record<string, any> = {};
        profs.forEach(p => { map[p.user_id] = p; });
        setProfiles(map);
      }
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !user) return;
    const { error } = await supabase.from("resources").insert({
      title, description, category, link: link || null, posted_by: user.id,
    });
    if (!error) {
      toast({ title: "Resource shared!" });
      setTitle(""); setDescription(""); setLink(""); setShowForm(false);
      fetchResources();
    } else toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("resources").delete().eq("id", id);
    toast({ title: "Resource deleted" });
    fetchResources();
  };

  const filtered = resources.filter(r => {
    const matchSearch = !searchTerm || r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !filterCat || r.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Resources Library</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Share Resource
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <Input placeholder="Resource title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Input placeholder="Link (optional)" value={link} onChange={e => setLink(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit}>Share</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input placeholder="Search resources..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{r.title}</h4>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{r.category}</span>
                  {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    By {profiles[r.posted_by]?.display_name ?? "Member"} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {r.link && (
                  <a href={r.link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost"><ExternalLink className="h-4 w-4" /></Button>
                  </a>
                )}
                {(isAdmin || r.posted_by === user?.id) && (
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-10 text-sm">No resources found. Be the first to share!</p>
        )}
      </div>
    </div>
  );
}

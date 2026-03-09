import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Check, X, Star, Edit, Trash2, Video } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  cohort: string | null;
  organization: string | null;
  testimony: string;
  image_url: string | null;
  video_url: string | null;
  status: string;
  featured: boolean;
  created_at: string;
}

export const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    let query = supabase.from("testimonies").select("*").order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data, error } = await query;

    if (data && !error) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("testimonies")
      .update({ status, approved: status === "approved" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success(`Testimonial ${status}`);
    fetchTestimonials();
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    const { error } = await supabase
      .from("testimonies")
      .update({ featured: !featured })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update featured status");
      return;
    }

    toast.success(featured ? "Removed from featured" : "Added to featured");
    fetchTestimonials();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const { error } = await supabase.from("testimonies").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete testimonial");
      return;
    }

    toast.success("Testimonial deleted");
    fetchTestimonials();
    setSelectedTestimonial(null);
  };

  const handleEdit = async (testimonial: Testimonial) => {
    const { error } = await supabase
      .from("testimonies")
      .update({
        name: testimonial.name,
        email: testimonial.email,
        role: testimonial.role,
        cohort: testimonial.cohort,
        organization: testimonial.organization,
        testimony: testimonial.testimony,
        video_url: testimonial.video_url,
      })
      .eq("id", testimonial.id);

    if (error) {
      toast.error("Failed to update testimonial");
      return;
    }

    toast.success("Testimonial updated");
    setIsEditing(false);
    fetchTestimonials();
  };

  const pendingCount = testimonials.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Testimonial Management</h2>
          <p className="text-muted-foreground">Review, approve, and manage testimonials</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {pendingCount} Pending Review
          </Badge>
        )}
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All ({testimonials.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({testimonials.filter((t) => t.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({testimonials.filter((t) => t.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({testimonials.filter((t) => t.status === "rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4 mt-6">
          {testimonials.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No testimonials found
              </CardContent>
            </Card>
          ) : (
            testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarImage src={testimonial.image_url || ""} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                            {testimonial.featured && (
                              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {testimonial.role && <Badge variant="secondary">{testimonial.role}</Badge>}
                            <Badge
                              variant={
                                testimonial.status === "approved"
                                  ? "default"
                                  : testimonial.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {testimonial.status}
                            </Badge>
                          </div>
                          {testimonial.email && (
                            <p className="text-sm text-muted-foreground mt-1">{testimonial.email}</p>
                          )}
                          {testimonial.organization && (
                            <p className="text-sm text-muted-foreground">{testimonial.organization}</p>
                          )}
                          {testimonial.cohort && (
                            <p className="text-sm text-muted-foreground">{testimonial.cohort}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-muted-foreground italic">{testimonial.testimony}</p>

                      {testimonial.video_url && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Video className="w-4 h-4" />
                          <a href={testimonial.video_url} target="_blank" rel="noopener noreferrer">
                            View video testimonial
                          </a>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        {testimonial.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateStatus(testimonial.id, "approved")}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateStatus(testimonial.id, "rejected")}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {testimonial.status === "approved" && (
                          <Button
                            size="sm"
                            variant={testimonial.featured ? "outline" : "secondary"}
                            onClick={() => toggleFeatured(testimonial.id, testimonial.featured)}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            {testimonial.featured ? "Unfeature" : "Feature"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTestimonial(testimonial);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTestimonial(testimonial.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          {selectedTestimonial && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={selectedTestimonial.name}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={selectedTestimonial.email || ""}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={selectedTestimonial.role || ""}
                  onValueChange={(value) =>
                    setSelectedTestimonial({ ...selectedTestimonial, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cohort</Label>
                <Input
                  value={selectedTestimonial.cohort || ""}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, cohort: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Organization</Label>
                <Input
                  value={selectedTestimonial.organization || ""}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, organization: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Testimonial</Label>
                <Textarea
                  value={selectedTestimonial.testimony}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, testimony: e.target.value })
                  }
                  rows={6}
                />
              </div>
              <div>
                <Label>Video URL</Label>
                <Input
                  value={selectedTestimonial.video_url || ""}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, video_url: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(selectedTestimonial)}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

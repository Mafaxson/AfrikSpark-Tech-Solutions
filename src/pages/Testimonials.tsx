import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quote, Search, Star, Video } from "lucide-react";
import { motion } from "framer-motion";

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
  featured: boolean;
  created_at: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [categories, setCategories] = useState<{ category_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCohort, setSelectedCohort] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    fetchTestimonials();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, selectedCategory, selectedCohort, searchQuery]);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonies")
      .select("*")
      .eq("status", "approved")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (data && !error) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("testimonial_categories")
      .select("category_name")
      .order("category_name");

    if (data) {
      setCategories(data);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.role === selectedCategory);
    }

    if (selectedCohort !== "all") {
      filtered = filtered.filter((t) => t.cohort === selectedCohort);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.testimony.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.organization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTestimonials(filtered);
  };

  const uniqueCohorts = Array.from(new Set(testimonials.map((t) => t.cohort).filter(Boolean)));
  const featuredTestimonials = filteredTestimonials.filter((t) => t.featured);
  const regularTestimonials = filteredTestimonials.filter((t) => !t.featured);

  const getVideoEmbedUrl = (url: string | null) => {
    if (!url) return null;
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  };

  const TestimonialCard = ({ testimonial, featured = false }: { testimonial: Testimonial; featured?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`p-6 h-full cursor-pointer hover:shadow-lg transition-all ${
          featured ? "border-primary border-2" : ""
        }`}
        onClick={() => setSelectedTestimonial(testimonial)}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={testimonial.image_url || ""} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  {testimonial.role && (
                    <Badge variant="secondary" className="mt-1">
                      {testimonial.role}
                    </Badge>
                  )}
                </div>
                {featured && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
              </div>
              {testimonial.organization && (
                <p className="text-sm text-muted-foreground mt-1">{testimonial.organization}</p>
              )}
              {testimonial.cohort && (
                <p className="text-sm text-muted-foreground">{testimonial.cohort}</p>
              )}
            </div>
          </div>

          <div className="relative flex-1">
            <Quote className="w-8 h-8 text-muted-foreground/20 absolute -top-2 -left-2" />
            <p className="text-muted-foreground italic line-clamp-4 pl-6">
              {testimonial.testimony}
            </p>
          </div>

          {testimonial.video_url && (
            <div className="mt-4 flex items-center gap-2 text-sm text-primary">
              <Video className="w-4 h-4" />
              <span>Watch video testimonial</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Success Stories & Testimonials
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Hear from our students, alumni, partners, and community members about their transformative experiences
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, keyword, or organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category_name} value={cat.category_name}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Cohort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cohorts</SelectItem>
                  {uniqueCohorts.map((cohort) => (
                    <SelectItem key={cohort} value={cohort!}>
                      {cohort}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && (
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                Featured Stories
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTestimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} featured />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Testimonials */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {regularTestimonials.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularTestimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No testimonials found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Detailed View Dialog */}
        <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedTestimonial && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedTestimonial.image_url || ""} alt={selectedTestimonial.name} />
                      <AvatarFallback>{selectedTestimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{selectedTestimonial.name}</span>
                        {selectedTestimonial.featured && (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      {selectedTestimonial.role && (
                        <Badge variant="secondary" className="mt-1">
                          {selectedTestimonial.role}
                        </Badge>
                      )}
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {selectedTestimonial.organization && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Organization</p>
                      <p>{selectedTestimonial.organization}</p>
                    </div>
                  )}
                  
                  {selectedTestimonial.cohort && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cohort</p>
                      <p>{selectedTestimonial.cohort}</p>
                    </div>
                  )}

                  {selectedTestimonial.video_url && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={getVideoEmbedUrl(selectedTestimonial.video_url) || ""}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div>
                    <Quote className="w-8 h-8 text-muted-foreground/20 mb-2" />
                    <p className="text-lg italic whitespace-pre-wrap">{selectedTestimonial.testimony}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Testimonials;

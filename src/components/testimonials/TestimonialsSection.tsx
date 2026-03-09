import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quote, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  cohort: string | null;
  organization: string | null;
  testimony: string;
  image_url: string | null;
  featured: boolean;
}

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonies")
      .select("id, name, role, cohort, organization, testimony, image_url, featured")
      .eq("status", "approved")
      .or("featured.eq.true,role.eq.Student,role.eq.Alumni,role.eq.Partner")
      .order("featured", { ascending: false })
      .limit(6);

    if (data && !error) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stories of Impact & Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from our community about their transformative experiences
          </p>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative">
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <TestimonialCard testimonial={testimonials[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden lg:grid lg:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/testimonials">
            <Button size="lg" variant="outline" className="group">
              View All Success Stories
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
    <div className="flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-14 h-14 flex-shrink-0">
          <AvatarImage src={testimonial.image_url || ""} alt={testimonial.name} />
          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{testimonial.name}</h3>
          {testimonial.role && (
            <Badge variant="secondary" className="mt-1">
              {testimonial.role}
            </Badge>
          )}
          {testimonial.organization && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {testimonial.organization}
            </p>
          )}
          {testimonial.cohort && (
            <p className="text-xs text-muted-foreground">{testimonial.cohort}</p>
          )}
        </div>
      </div>

      <div className="relative flex-1">
        <Quote className="w-8 h-8 text-muted-foreground/20 absolute -top-2 -left-2" />
        <p className="text-muted-foreground italic line-clamp-5 pl-6">
          {testimonial.testimony}
        </p>
      </div>
    </div>
  </Card>
);

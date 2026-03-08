import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader, AnimateOnScroll } from "@/components/SectionComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, Lightbulb, Code, DollarSign, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const offerings = [
  { icon: Users, title: "Mentorship", desc: "One-on-one guidance from experienced founders and tech leaders." },
  { icon: Code, title: "Technical Support", desc: "Help building MVPs, prototypes, and scalable products." },
  { icon: Lightbulb, title: "Product Development", desc: "Strategic guidance on product-market fit and user research." },
  { icon: DollarSign, title: "Funding Access", desc: "Connections to investors, grants, and funding opportunities." },
];

export default function VentureStudio() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const { error } = await supabase.from("startups").insert({
      founder_name: formData.get("founder") as string,
      startup_name: formData.get("startup") as string,
      problem: formData.get("problem") as string,
      solution: formData.get("solution") as string,
      stage: formData.get("stage") as string,
      website: formData.get("website") as string || null,
    });
    if (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } else {
      toast({ title: "Application Submitted!", description: "We'll review and reach out." });
      form.reset();
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="bg-hero min-h-[50vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,hsl(25_95%_53%/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <AnimateOnScroll>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
              <Rocket className="h-4 w-4" />
              Venture Studio
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4 max-w-3xl">
              AfrikSpark <span className="text-gradient">Venture Studio</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Supporting young innovators and startups developing solutions to real-world challenges across Africa.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <Section>
        <SectionHeader badge="What We Provide" title="Startup Support" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerings.map((o, i) => (
            <AnimateOnScroll key={o.title} delay={i * 80}>
              <div className="bg-card rounded-xl p-6 border border-border card-hover text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <o.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{o.title}</h3>
                <p className="text-sm text-muted-foreground">{o.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader badge="Apply" title="Submit Your Startup" />
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Founder Name</label>
                <Input name="founder" required placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Startup Name</label>
                <Input name="startup" required placeholder="Startup name" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Problem Being Solved</label>
              <Textarea required placeholder="Describe the problem..." rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Your Solution</label>
              <Textarea required placeholder="Describe your solution..." rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Stage</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="prototype">Prototype</SelectItem>
                    <SelectItem value="mvp">MVP</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Website (optional)</label>
                <Input placeholder="https://..." />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </Section>
    </Layout>
  );
}

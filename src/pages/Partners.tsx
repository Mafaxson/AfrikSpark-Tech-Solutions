import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader, AnimateOnScroll } from "@/components/SectionComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake, Award, Users, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  { icon: Award, title: "Brand Visibility", desc: "Showcase your brand across our programs and platforms." },
  { icon: Users, title: "Community Impact", desc: "Direct recognition for empowering youth in Africa." },
  { icon: Lightbulb, title: "Access to Talent", desc: "Connect with skilled and motivated young digital professionals." },
  { icon: Handshake, title: "Innovation Programs", desc: "Participate in technology projects driving social change." },
];

export default function Partners() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const { error } = await supabase.from("partners").insert({
      organization_name: formData.get("org_name") as string,
      contact_person: formData.get("contact") as string,
      email: formData.get("email") as string,
      country: formData.get("country") as string,
      interest: formData.get("interest") as string,
      message: formData.get("message") as string,
    });
    if (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } else {
      toast({ title: "Partnership Request Sent!", description: "We'll be in touch soon." });
      form.reset();
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="bg-hero min-h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(25_95%_53%/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <AnimateOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Partnerships</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Partner With AfrikSpark</h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Work with us to empower young people with digital skills and innovation opportunities.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <Section>
        <SectionHeader badge="Why Partner" title="Sponsor Benefits" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <AnimateOnScroll key={b.title} delay={i * 80}>
              <div className="text-center p-6 bg-card rounded-xl border border-border card-hover">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Section>

      <Section alt id="partner-form">
        <SectionHeader badge="Get Started" title="Partner Application" />
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Organization Name</label>
                <Input required placeholder="Your organization" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Contact Person</label>
                <Input required placeholder="Full name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input type="email" required placeholder="email@org.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Country</label>
                <Input required placeholder="Country" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Partnership Interest</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sponsor-dss">Sponsor DSS Scholarships</SelectItem>
                  <SelectItem value="fund-projects">Fund Innovation Projects</SelectItem>
                  <SelectItem value="youth-training">Support Youth Training</SelectItem>
                  <SelectItem value="mentorship">Provide Mentorship</SelectItem>
                  <SelectItem value="tech-collab">Technology Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Message</label>
              <Textarea placeholder="Tell us about your interest..." rows={4} />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Sending..." : "Submit Partnership Request"}
            </Button>
          </form>
        </div>
      </Section>
    </Layout>
  );
}

import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader, AnimateOnScroll } from "@/components/SectionComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Message Sent!", description: "We'll get back to you soon." });
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <Layout>
      <section className="bg-hero min-h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(25_95%_53%/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <AnimateOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Contact</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Get in Touch</h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">Have questions? We'd love to hear from you.</p>
          </AnimateOnScroll>
        </div>
      </section>

      <Section>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <AnimateOnScroll>
              <h2 className="font-display text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: "Location", value: "Sierra Leone" },
                  { icon: Mail, label: "Email", value: "info@afrikspark.com" },
                  { icon: Phone, label: "Phone", value: "+232 XX XXX XXXX" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <AnimateOnScroll delay={100}>
              <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                    <Input required placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                    <Input type="email" required placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Subject</label>
                  <Input required placeholder="Subject" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <Textarea required placeholder="Your message..." rows={5} />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </AnimateOnScroll>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

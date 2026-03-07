import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Section, SectionHeader, AnimateOnScroll } from "@/components/SectionComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Palette, Video, Camera, Code, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const skills = [
  { icon: Megaphone, title: "Content Creation" },
  { icon: Palette, title: "Graphic Design" },
  { icon: Video, title: "Videography" },
  { icon: Camera, title: "Photography" },
  { icon: Code, title: "Web & App Development" },
];

export default function DSS() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Will connect to Supabase later
    setTimeout(() => {
      toast({ title: "Application Submitted!", description: "We'll review your application and get back to you." });
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <Layout>
      <section className="bg-hero min-h-[50vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(25_95%_53%/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <AnimateOnScroll>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
              <GraduationCap className="h-4 w-4" />
              Digital Skills Scholarship
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4 max-w-3xl">
              Transform Your Future with <span className="text-gradient">Free Digital Skills</span> Training
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              The DSS program trains young people who completed high school but cannot attend university due to financial barriers. Gain practical skills and mentorship until you start earning.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Skills */}
      <Section>
        <SectionHeader badge="What You'll Learn" title="Skills Covered" description="Master in-demand digital skills that open doors to freelancing, employment, and entrepreneurship." />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {skills.map((skill, i) => (
            <AnimateOnScroll key={skill.title} delay={i * 80}>
              <div className="text-center p-6 rounded-xl bg-card border border-border card-hover">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <skill.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-sm">{skill.title}</h3>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Section>

      {/* Application Form */}
      <Section alt id="apply">
        <SectionHeader badge="Join Us" title="Apply for DSS" description="Fill out the form below to apply for our next cohort." />
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input name="name" required placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input name="email" type="email" required placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone</label>
                <Input name="phone" required placeholder="+232..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">City</label>
                <Input name="city" required placeholder="Your city" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Age</label>
                <Input name="age" type="number" required placeholder="Your age" min={15} max={40} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Education Level</label>
                <Select name="education" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ssce">SSCE / WASSCE</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="some-university">Some University</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Skill Interest</label>
              <Select name="skill_interest" required>
                <SelectTrigger>
                  <SelectValue placeholder="Which skill interests you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content-creation">Content Creation</SelectItem>
                  <SelectItem value="graphic-design">Graphic Design</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="web-dev">Web & App Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Why do you want to join DSS?</label>
              <Textarea name="motivation" required placeholder="Tell us about yourself and your goals..." rows={4} />
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

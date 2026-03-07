import { Layout } from "@/components/Layout";
import { Section, SectionHeader, AnimateOnScroll } from "@/components/SectionComponents";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "GreenBin Connect",
    desc: "A climate innovation project improving waste management in Sierra Leone through technology-driven solutions and community engagement.",
    tag: "Climate Tech",
  },
  {
    title: "Citizens Voice",
    desc: "A civic-tech platform ensuring citizen participation and inclusive governance by amplifying community voices through digital tools.",
    tag: "Civic Tech",
  },
  {
    title: "Digital Skills Scholarship",
    desc: "A comprehensive scholarship program providing free digital skills training to underprivileged youth across Sierra Leone.",
    tag: "Education",
  },
];

export default function Projects() {
  return (
    <Layout>
      <section className="bg-hero min-h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(25_95%_53%/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <AnimateOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Our Work</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Innovation Projects</h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Technology-driven projects addressing real challenges across Africa.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <AnimateOnScroll key={project.title} delay={i * 100}>
              <div className="bg-card rounded-xl border border-border overflow-hidden card-hover h-full flex flex-col">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-primary/60">{project.title.charAt(0)}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded mb-3 w-fit">
                    {project.tag}
                  </span>
                  <h3 className="font-display font-bold text-xl mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{project.desc}</p>
                  <Button variant="ghost" size="sm" className="mt-4 w-fit">
                    Learn More <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

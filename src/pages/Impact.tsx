import { Layout } from "@/components/Layout";
import { Section, SectionHeader, AnimateOnScroll, StatCounter } from "@/components/SectionComponents";

const stats = [
  { value: "50+", label: "Youth Trained in Digital Skills" },
  { value: "200+", label: "Students Developed" },
  { value: "1000+", label: "Community Members Impacted" },
  { value: "3+", label: "Innovation Projects Launched" },
];

export default function Impact() {
  return (
    <Layout>
      <section className="bg-hero min-h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(25_95%_53%/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <AnimateOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Our Impact</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Making a Difference
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Every number tells a story of transformation and empowerment.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat, i) => (
            <AnimateOnScroll key={stat.label} delay={i * 100}>
              <StatCounter value={stat.value} label={stat.label} />
            </AnimateOnScroll>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader badge="Stories" title="Impact Stories" description="Real stories from the youth we've empowered through our programs." />
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: "Youth Training", text: "Our Digital Skills Scholarship has helped dozens of young people gain marketable skills and start earning from their talents." },
            { name: "Community Projects", text: "Through GreenBin Connect and Citizens Voice, we're addressing real challenges in waste management and civic engagement." },
          ].map((story, i) => (
            <AnimateOnScroll key={i} delay={i * 100}>
              <div className="bg-card rounded-xl p-8 border border-border">
                <h3 className="font-display font-bold text-lg mb-3">{story.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{story.text}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

import { Layout } from "@/components/Layout";
import { Section, SectionHeader, AnimateOnScroll } from "@/components/SectionComponents";

export default function Blog() {
  return (
    <Layout>
      <section className="bg-hero min-h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(25_95%_53%/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <AnimateOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Blog</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Stories & Insights
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Updates, stories, and insights from the AfrikSpark community.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <Section>
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Blog posts coming soon. Stay tuned!</p>
        </div>
      </Section>
    </Layout>
  );
}

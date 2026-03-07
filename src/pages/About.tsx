import { Layout } from "@/components/Layout";
import { Section, SectionHeader, AnimateOnScroll } from "@/components/SectionComponents";
import { Target, Eye, Heart, Lightbulb, Users, Shield } from "lucide-react";

const values = [
  { icon: Heart, title: "Empowerment", desc: "Equipping youth with skills to transform their futures." },
  { icon: Lightbulb, title: "Innovation", desc: "Fostering creative solutions to real-world challenges." },
  { icon: Users, title: "Community", desc: "Building a supportive ecosystem for growth." },
  { icon: Shield, title: "Integrity", desc: "Operating with transparency and accountability." },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero min-h-[50vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,hsl(25_95%_53%/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <AnimateOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">About Us</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4 max-w-2xl">
              Building Africa's Digital Future, One Spark at a Time
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Founded by Ishmeal Kamara in 2024, AfrikSpark Tech Solutions empowers underprivileged youth in Sierra Leone with digital skills and entrepreneurial opportunities.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Story */}
      <Section>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AnimateOnScroll>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">Our Story</span>
            <h2 className="font-display text-3xl font-bold mb-4">From NextGen to AfrikSpark</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Formerly known as NextGen Tech Solution, AfrikSpark Tech Solutions was born from a deep passion for bridging the digital divide in Africa. Starting in Sierra Leone, we've grown into a comprehensive technology solutions and training organization.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our focus is on empowering young people who have the potential but lack the resources — giving them practical digital skills, mentorship, and a pathway to earning from their talents.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div className="bg-section-alt rounded-2xl p-8 border border-border">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-display text-3xl font-bold text-gradient">2024</div>
                  <div className="text-sm text-muted-foreground mt-1">Founded</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-gradient">SL</div>
                  <div className="text-sm text-muted-foreground mt-1">Sierra Leone</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-gradient">50+</div>
                  <div className="text-sm text-muted-foreground mt-1">Youth Trained</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-gradient">3+</div>
                  <div className="text-sm text-muted-foreground mt-1">Projects</div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section alt>
        <div className="grid md:grid-cols-2 gap-8">
          <AnimateOnScroll>
            <div className="bg-card rounded-xl p-8 border border-border h-full">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower underprivileged youth across Africa with practical digital skills, entrepreneurial training, and technology solutions that create sustainable livelihoods and drive economic growth.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <div className="bg-card rounded-xl p-8 border border-border h-full">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A digitally skilled and economically empowered African youth population, leading innovation and contributing to sustainable development across the continent.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </Section>

      {/* Core Values */}
      <Section>
        <SectionHeader badge="Our Principles" title="Core Values" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <AnimateOnScroll key={value.title} delay={i * 100}>
              <div className="text-center p-6">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

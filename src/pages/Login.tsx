import { Layout } from "@/components/Layout";
import { Section, AnimateOnScroll } from "@/components/SectionComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
      <Section className="min-h-[80vh] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <AnimateOnScroll>
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? "Sign in to access the community and dashboard." : "Join the AfrikSpark community."}
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input placeholder="Your name" />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" size="lg">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </Section>
    </Layout>
  );
}

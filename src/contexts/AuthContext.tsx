import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isApproved: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isApproved: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // Use setTimeout to avoid potential deadlock with Supabase auth
        setTimeout(async () => {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", currentUser.id);
          setIsAdmin(roles?.some(r => r.role === "admin") ?? false);

          const { data: profile } = await supabase
            .from("profiles")
            .select("approved")
            .eq("user_id", currentUser.id)
            .single();
          setIsApproved(profile?.approved ?? false);
          setLoading(false);
        }, 0);
      } else {
        setIsAdmin(false);
        setIsApproved(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isApproved, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

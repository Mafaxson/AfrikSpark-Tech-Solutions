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
    let isMounted = true;

    const loadUserState = async (currentUser: User | null) => {
      if (!currentUser) {
        if (isMounted) {
          setIsAdmin(false);
          setIsApproved(false);
          setLoading(false);
        }
        return;
      }

      // load roles and profile (approved status)
      const [{ data: roles }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", currentUser.id),
        supabase.from("profiles").select("approved").eq("user_id", currentUser.id).single(),
      ]);

      const isAdminUser = roles?.some((r: any) => r.role === "admin") ?? false;
      const approved = profile?.approved ?? false;

      if (!isMounted) return;
      setIsAdmin(isAdminUser);
      setIsApproved(isAdminUser || approved);
      setLoading(false);
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      if (isMounted) setUser(currentUser);
      await loadUserState(currentUser);
    });

    // Then get initial session
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data?.session?.user ?? null;
      if (isMounted) setUser(currentUser);
      loadUserState(currentUser);
    }).catch((error) => {
      console.error("Error getting initial session:", error);
      if (isMounted) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isApproved, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
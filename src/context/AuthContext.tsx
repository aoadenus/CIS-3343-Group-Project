import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export type StaffRole =
  | "owner"
  | "manager"
  | "accountant"
  | "sales"
  | "baker"
  | "decorator";

export interface StaffUser {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
  metadata?: Record<string, unknown>;
}

interface AuthContextValue {
  user: StaffUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  hasRole: (...roles: StaffRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function extractStaffUser(session: Session | null): {
  user: StaffUser | null;
  token: string | null;
} {
  if (!session?.user) {
    return { user: null, token: null };
  }

  const supaUser = session.user;
  const metadata = supaUser.user_metadata ?? {};
  const role = (metadata.role ?? "sales") as StaffRole;
  const fullName =
    (metadata.full_name as string | undefined) ??
    supaUser.email?.split("@")[0] ??
    "Staff Member";

  return {
    user: {
      id: supaUser.id,
      email: supaUser.email ?? "",
      fullName,
      role,
      metadata,
    },
    token: session.access_token ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSession = useCallback((session: Session | null) => {
    const { user: parsedUser, token: parsedToken } = extractStaffUser(session);
    setUser(parsedUser);
    setToken(parsedToken);
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      syncSession(session);
      setIsLoading(false);
    };

    init();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [syncSession]);

  const hasRole = useCallback(
    (...roles: StaffRole[]) => {
      if (!user) {
        return false;
      }

      if (user.role === "owner") {
        return true;
      }

      if (roles.length === 0) {
        return true;
      }

      return roles.includes(user.role);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      logout,
      hasRole,
    }),
    [user, token, isLoading, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

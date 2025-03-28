import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { User, insertUserSchema } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthUser = Omit<User, 'password'>;

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AuthUser, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<AuthUser, Error, RegisterCredentials>;
};

type LoginCredentials = {
  username: string;
  password: string;
};

type RegisterCredentials = {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName?: string;
  email?: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/session"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        
        if (res.status === 401 || !data.authenticated) {
          return null;
        }
        
        return data.user;
      } catch (error) {
        console.error("Error fetching user session:", error);
        return null;
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
    },
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(["/api/auth/session"], { authenticated: true, user });
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await apiRequest("POST", "/api/auth/register", credentials);
      return await res.json();
    },
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(["/api/auth/session"], { authenticated: true, user });
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.firstName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/session"], { authenticated: false, user: null });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
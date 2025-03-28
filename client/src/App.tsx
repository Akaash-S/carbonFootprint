import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Pages
import Dashboard from "@/pages/dashboard";
import Scanner from "@/pages/scanner";
import ManualEntry from "@/pages/manual-entry";
import VoiceInput from "@/pages/voice-input";
import Insights from "@/pages/insights";
import Challenges from "@/pages/challenges";
import Community from "@/pages/community";
import Marketplace from "@/pages/marketplace";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";

function Router() {
  return (
    <Switch>
      {/* Protected routes */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/scanner" component={Scanner} />
      <ProtectedRoute path="/manual-entry" component={ManualEntry} />
      <ProtectedRoute path="/voice-input" component={VoiceInput} />
      <ProtectedRoute path="/insights" component={Insights} />
      <ProtectedRoute path="/challenges" component={Challenges} />
      <ProtectedRoute path="/community" component={Community} />
      <ProtectedRoute path="/marketplace" component={Marketplace} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/profile" component={Profile} />

      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

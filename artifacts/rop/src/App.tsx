import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Collection from "@/pages/collection";
import Codex from "@/pages/codex";
import Tasks from "@/pages/tasks";
import Battle from "@/pages/battle";
import Profile from "@/pages/profile";
import AR from "@/pages/ar";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Splash() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100]">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-24 h-24 rounded-full bg-primary/20 blur-xl absolute"
      />
      <Leaf className="w-12 h-12 text-primary relative z-10 animate-pulse" />
      <h1 className="mt-6 text-2xl font-bold font-sans tracking-widest uppercase">Rise of the Plants</h1>
      <p className="mt-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">Initializing Sanctuary...</p>
    </div>
  );
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 text-center z-[100]">
      <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4 text-destructive">
        X
      </div>
      <h1 className="text-xl font-bold mb-2">Initialization Failed</h1>
      <p className="text-sm text-muted-foreground font-mono">{error}</p>
    </div>
  );
}

function Router() {
  const { initialized, loading, error, init } = useGameStore();

  useEffect(() => {
    init();
  }, [init]);

  if (error) return <ErrorScreen error={error} />;
  if (!initialized || loading) return <Splash />;

  return (
    <Switch>
      {/* AR is a full-screen overlay route, rendered outside the tabbed layout */}
      <Route path="/ar" component={AR} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/collection" component={Collection} />
            <Route path="/codex/:slug" component={Codex} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/battle" component={Battle} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import React from "react";
import { Link, useLocation } from "wouter";
import { useGameStore } from "@/store/gameStore";
import { Leaf, BookOpen, CheckSquare, Swords, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const demoMode = useGameStore((s) => s.demoMode);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-x-hidden">
      {demoMode && (
        <div className="w-full bg-accent/20 text-accent text-center text-xs py-1 font-mono tracking-wider absolute top-0 z-50">
          DEMO MODE ACTIVE
        </div>
      )}

      <main className="flex-1 w-full max-w-md mx-auto relative flex flex-col pb-20 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col h-full w-full px-4"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-t border-border z-40">
        <div className="max-w-md mx-auto h-full flex items-center justify-around px-2">
          <NavItem href="/" icon={<Leaf size={20} />} label="Garden" active={location === "/"} />
          <NavItem href="/tasks" icon={<CheckSquare size={20} />} label="Tasks" active={location === "/tasks"} />
          <NavItem href="/collection" icon={<BookOpen size={20} />} label="Collection" active={location.startsWith("/collection") || location.startsWith("/codex")} />
          <NavItem href="/battle" icon={<Swords size={20} />} label="Battle" active={location === "/battle"} />
          <NavItem href="/profile" icon={<User size={20} />} label="Profile" active={location === "/profile"} />
        </div>
      </nav>
      
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} className={cn(
      "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-200",
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    )}>
      <div className={cn("transition-transform duration-300", active && "scale-110")}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </Link>
  );
}

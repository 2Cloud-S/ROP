import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Sprout, Swords, Camera, ArrowRight } from "lucide-react";

const ONBOARDED_KEY = "rop_onboarded";

const STEPS = [
  {
    icon: Leaf,
    title: "Rise of the Plants",
    body: "Discover, grow, and evolve a collection of living botanical creatures — a pocket sanctuary that rises with you.",
  },
  {
    icon: Sprout,
    title: "Grow & Evolve",
    body: "Complete real-world rituals to earn water, nutrients, and sunlight. Spend them to grow your plant, then evolve it into rarer forms.",
  },
  {
    icon: Swords,
    title: "Battle & Collect",
    body: "Test your flora against wild species to earn rewards and unlock new discoveries for your Codex.",
  },
  {
    icon: Camera,
    title: "See Them in AR",
    body: "Project your plant into the real world through your camera and capture a shot to share.",
  },
];

export function Onboarding() {
  const [open, setOpen] = useState(
    () => typeof window !== "undefined" && !localStorage.getItem(ONBOARDED_KEY),
  );
  const [step, setStep] = useState(0);

  if (!open) return null;

  const finish = () => {
    try {
      localStorage.setItem(ONBOARDED_KEY, "1");
    } catch {
      /* ignore storage failures */
    }
    setOpen(false);
  };

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[130] flex flex-col bg-background">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-1/4 w-2/3 h-2/3 bg-primary/15 rounded-full blur-[120px]"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 -right-1/4 w-2/3 h-2/3 bg-accent/15 rounded-full blur-[120px]"
          animate={{ opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center max-w-md mx-auto w-full">
        <div className="flex items-center justify-end w-full mb-8">
          <button
            onClick={finish}
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-3xl bg-primary/12 text-primary flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(var(--primary),0.25)] border border-primary/20"
            >
              <Icon size={44} />
            </motion.div>
            <h1 className="text-3xl font-bold font-sans tracking-tight mb-4">
              {current.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-[15px]">
              {current.body}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="w-full pb-10 pt-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-primary" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold tracking-wide"
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          >
            {isLast ? "Enter the Sanctuary" : "Next"}
            <ArrowRight size={18} className="ml-2" />
          </Button>

          <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70">
            Replit × Sanity Buildathon · Content powered by Sanity
          </p>
        </div>
      </div>
    </div>
  );
}

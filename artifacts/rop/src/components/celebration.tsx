import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGameStore, type Celebration } from "@/store/gameStore";
import { useSpeciesBySlug } from "@/hooks/useContent";
import { PlantVisual } from "@/components/plant-visual";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowUpCircle, BookOpen, Star } from "lucide-react";

/** Radial burst of particles emanating from the center of the overlay. */
function Particles({ count = 28, color }: { count?: number; color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 110 + Math.random() * 200;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const size = 4 + Math.random() * 9;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color || "hsl(var(--primary))",
              boxShadow: `0 0 8px ${color || "hsl(var(--primary))"}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            transition={{ duration: 1.3 + Math.random() * 0.7, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function RarityBadge({ rarity, color }: { rarity?: string; color?: string }) {
  if (!rarity) return null;
  return (
    <span
      className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest border"
      style={{
        color: color || "hsl(var(--primary))",
        borderColor: color || "hsl(var(--primary))",
        backgroundColor: `color-mix(in srgb, ${color || "hsl(var(--primary))"} 12%, transparent)`,
      }}
    >
      {rarity}
    </span>
  );
}

function Backdrop({
  children,
  glow,
}: {
  children: React.ReactNode;
  glow?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-background/85 backdrop-blur-md"
    >
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: glow || "hsl(var(--primary))", opacity: 0.25 }}
        animate={{ scale: [0.8, 1.15, 1], opacity: [0, 0.3, 0.22] }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {children}
    </motion.div>
  );
}

function EvolutionView({
  celebration,
  onDismiss,
}: {
  celebration: Extract<Celebration, { kind: "evolution" }>;
  onDismiss: () => void;
}) {
  const navigate = useNavigate();
  const { data: species } = useSpeciesBySlug(celebration.slug);
  const glow = species?.rarityGlow || species?.primaryColor;

  return (
    <Backdrop glow={glow}>
      <Particles color={glow} />
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-accent mb-2"
        >
          Evolution Complete
        </motion.p>

        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.05 }}
          className="relative my-2"
        >
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ backgroundColor: glow || "hsl(var(--primary))" }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <PlantVisual
            speciesSlug={celebration.slug}
            stage={4}
            colors={{ primary: species?.primaryColor, glow: species?.rarityGlow }}
            imageUrl={species?.imageUrl}
            className="w-56 h-56 relative z-10"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-3xl font-bold font-sans tracking-tight"
        >
          {species?.name || "New Form"}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-3 flex items-center gap-2"
        >
          <RarityBadge rarity={species?.rarity} color={species?.rarityColor} />
          {celebration.newlyDiscovered && (
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest border border-primary text-primary bg-primary/10">
              New Species
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 gap-3 w-full"
        >
          <Button
            variant="secondary"
            className="font-bold tracking-wide"
            onClick={onDismiss}
          >
            Continue
          </Button>
          <Button
            className="font-bold tracking-wide"
            onClick={() => {
              navigate(`/codex/${celebration.slug}`);
              onDismiss();
            }}
          >
            <BookOpen size={16} className="mr-2" /> View Codex
          </Button>
        </motion.div>
      </div>
    </Backdrop>
  );
}

function DiscoveryView({
  celebration,
  onDismiss,
}: {
  celebration: Extract<Celebration, { kind: "discovery" }>;
  onDismiss: () => void;
}) {
  const navigate = useNavigate();
  const { data: species } = useSpeciesBySlug(celebration.slug);
  const glow = species?.rarityGlow || species?.primaryColor;
  const excerpt = species?.loreExcerpt || species?.description;

  return (
    <Backdrop glow={glow}>
      <Particles color={glow} />
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-primary mb-2"
        >
          <Sparkles size={14} /> New Discovery
        </motion.div>

        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className="relative my-2"
        >
          <PlantVisual
            speciesSlug={celebration.slug}
            stage={4}
            colors={{ primary: species?.primaryColor, glow: species?.rarityGlow }}
            imageUrl={species?.imageUrl}
            className="w-52 h-52 relative z-10"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold font-sans tracking-tight"
        >
          {species?.name || "Unknown Species"}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3"
        >
          <RarityBadge rarity={species?.rarity} color={species?.rarityColor} />
        </motion.div>

        {excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-muted-foreground leading-relaxed italic line-clamp-3"
          >
            "{excerpt}"
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 gap-3 w-full"
        >
          <Button
            variant="secondary"
            className="font-bold tracking-wide"
            onClick={onDismiss}
          >
            Continue
          </Button>
          <Button
            className="font-bold tracking-wide"
            onClick={() => {
              navigate(`/codex/${celebration.slug}`);
              onDismiss();
            }}
          >
            <BookOpen size={16} className="mr-2" /> View Codex
          </Button>
        </motion.div>
      </div>
    </Backdrop>
  );
}

function LevelUpView({
  celebration,
  onDismiss,
}: {
  celebration: Extract<Celebration, { kind: "levelup" }>;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <Backdrop>
      <Particles count={20} />
      <button
        className="absolute inset-0 cursor-default"
        aria-label="Dismiss"
        onClick={onDismiss}
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="absolute -inset-10 rounded-full border-2 border-primary/40"
          initial={{ scale: 0.4, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", repeat: 1 }}
        />
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 14 }}
          className="w-20 h-20 rounded-3xl bg-primary/15 text-primary flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(var(--primary),0.4)]"
        >
          <ArrowUpCircle size={40} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground"
        >
          Level Up
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
          className="text-5xl font-bold font-sans tracking-tight mt-1 flex items-center gap-2"
        >
          <Star size={28} className="text-accent" /> {celebration.level}
        </motion.h2>
      </div>
    </Backdrop>
  );
}

export function CelebrationLayer() {
  const celebrations = useGameStore((s) => s.celebrations);
  const dismiss = useGameStore((s) => s.dismissCelebration);
  const current = celebrations[0];

  return (
    <AnimatePresence>
      {current &&
        (current.kind === "evolution" ? (
          <EvolutionView key={current.id} celebration={current} onDismiss={dismiss} />
        ) : current.kind === "discovery" ? (
          <DiscoveryView key={current.id} celebration={current} onDismiss={dismiss} />
        ) : (
          <LevelUpView key={current.id} celebration={current} onDismiss={dismiss} />
        ))}
    </AnimatePresence>
  );
}

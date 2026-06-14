import React from "react";
import { useGameStore } from "@/store/gameStore";
import { useSpecies } from "@/hooks/useContent";
import { MILESTONES } from "@workspace/game-core";
import { motion } from "framer-motion";
import {
  Droplets,
  Sprout,
  Sun,
  Award,
  Sparkles,
  Swords,
  CheckSquare,
  ArrowUpCircle,
  Lock,
} from "lucide-react";

export default function Profile() {
  const player = useGameStore((s) => s.player);
  const demoMode = useGameStore((s) => s.demoMode);
  const { data: allSpecies = [] } = useSpecies();

  if (!player) return null;

  const totalSpecies = allSpecies.length || 13;
  const discovered = player.discoveries.length;

  return (
    <div className="py-6 flex flex-col h-full pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-sans tracking-tight">Profile</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Your journey through Verdantia
        </p>
      </div>

      {/* Current title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-5 shadow-lg mb-4 flex items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Award size={26} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Current Title
          </p>
          <h2 className="text-xl font-bold font-sans truncate">{player.title}</h2>
        </div>
      </motion.div>

      {demoMode && (
        <div className="mb-4 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-accent">
            Demo Mode Active — 3× XP & boosted discovery
          </p>
        </div>
      )}

      {/* Discovery stats */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-lg mb-4">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-bold font-sans">Discovery</h3>
          <span className="font-mono text-sm text-muted-foreground">
            {discovered} / {totalSpecies}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(100, (discovered / totalSpecies) * 100)}%`,
            }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Resource totals */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <ResourceCard
          icon={<Droplets className="text-blue-400" size={20} />}
          label="Water"
          value={player.resources.water}
        />
        <ResourceCard
          icon={<Sprout className="text-green-400" size={20} />}
          label="Nutrients"
          value={player.resources.nutrients}
        />
        <ResourceCard
          icon={<Sun className="text-yellow-400" size={20} />}
          label="Sunlight"
          value={player.resources.sunlight}
        />
      </div>

      {/* Lifetime stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          icon={<Swords size={18} className="text-muted-foreground" />}
          label="Battles Won"
          value={player.stats.battlesWon}
        />
        <StatCard
          icon={<Swords size={18} className="text-muted-foreground" />}
          label="Battles Lost"
          value={player.stats.battlesLost}
        />
        <StatCard
          icon={<ArrowUpCircle size={18} className="text-muted-foreground" />}
          label="Evolutions"
          value={player.stats.evolutions}
        />
        <StatCard
          icon={<CheckSquare size={18} className="text-muted-foreground" />}
          label="Tasks Done"
          value={player.stats.tasksCompleted}
        />
      </div>

      {/* Milestones */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold font-sans mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-accent" /> Milestones
        </h3>
        <div className="space-y-2">
          {MILESTONES.filter((m) => m.count > 0).map((m) => {
            const achieved = discovered >= m.count;
            return (
              <div
                key={m.count}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                  achieved
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achieved
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {achieved ? <Award size={16} /> : <Lock size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {m.title}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      Discover {m.count} species
                    </p>
                  </div>
                </div>
                {achieved && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                    Unlocked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm">
      {icon}
      <span className="font-mono font-bold text-lg">{value}</span>
      <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-mono text-muted-foreground">{label}</span>
      </div>
      <span className="font-mono font-bold text-lg">{value}</span>
    </div>
  );
}

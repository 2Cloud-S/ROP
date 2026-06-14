import React, { useState } from "react";
import { Link } from "wouter";
import { useGameStore } from "@/store/gameStore";
import { useSpeciesBySlug } from "@/hooks/useContent";
import { GROWTH_ACTIONS, LEVEL_TOTAL_XP } from "@workspace/game-core";
import { PlantVisual } from "@/components/plant-visual";
import { ResourceBar } from "@/components/resource-bar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUpCircle, AlertCircle, Camera } from "lucide-react";
import type { GrowthActionId } from "@workspace/game-core";

export default function Home() {
  const { player, activePlant, grow, evolve, discover, demoMode } = useGameStore();
  const { toast } = useToast();
  const plant = activePlant();
  const { data: species, isLoading } = useSpeciesBySlug(plant?.speciesSlug);
  
  const [isGrowing, setIsGrowing] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionReady, setEvolutionReady] = useState(false);
  const [discoveryPrompt, setDiscoveryPrompt] = useState(false);

  if (!player) return null;

  if (!plant) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-32 h-32 rounded-full bg-card flex items-center justify-center border border-border shadow-xl">
          <Sparkles className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-sans">No Active Plant</h2>
          <p className="text-muted-foreground font-mono text-sm">Discover your first botanical companion.</p>
        </div>
        <Button 
          size="lg" 
          onClick={async () => {
            try {
              const res = await discover();
              if (res.newlyDiscovered) {
                toast({ title: "New species discovered!", description: res.discovered?.name });
              }
            } catch (e: any) {
              toast({ title: "Discovery failed", description: e.message, variant: "destructive" });
            }
          }}
          className="w-full font-mono font-bold tracking-wide"
        >
          SEARCH WILDERNESS
        </Button>
      </div>
    );
  }

  const handleGrow = async (action: GrowthActionId) => {
    setIsGrowing(true);
    try {
      const result = await grow(plant.id, action);
      if (result.leveledUp) {
        toast({
          title: "Level Up!",
          description: `Your plant reached level ${result.toLevel}`,
        });
      }
      if (result.evolutionReady) {
        setEvolutionReady(true);
      }
    } catch (e: any) {
      toast({ title: "Growth failed", description: e.message, variant: "destructive" });
    } finally {
      setIsGrowing(false);
    }
  };

  const handleEvolve = async () => {
    setIsEvolving(true);
    try {
      const res = await evolve(plant.id);
      setEvolutionReady(false);
      toast({
        title: "Evolution Complete!",
        description: `Your plant evolved into ${res.toSlug}!`,
      });
      if (res.newlyDiscovered) {
        setTimeout(() => toast({ title: "New Species Documented!" }), 1000);
      }
    } catch (e: any) {
      toast({ title: "Evolution failed", description: e.message, variant: "destructive" });
    } finally {
      setIsEvolving(false);
    }
  };

  const xpForCurrentLevel = LEVEL_TOTAL_XP[plant.level] || 0;
  const xpForNextLevel = LEVEL_TOTAL_XP[plant.level + 1] || xpForCurrentLevel;
  const xpProgress = plant.level >= 20 ? 100 : Math.max(0, Math.min(100, ((plant.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100));

  return (
    <div className="flex-1 flex flex-col pt-4">
      <ResourceBar />
      
      <div className="flex-1 flex flex-col items-center justify-center relative my-8">
        <AnimatePresence>
          {isGrowing && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 2], opacity: [1, 0] }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl z-0 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <PlantVisual 
          speciesSlug={plant.speciesSlug}
          stage={plant.stage}
          colors={{ primary: species?.primaryColor, glow: species?.rarityGlow }}
          imageUrl={species?.imageUrl}
          className={cn("w-64 h-64 z-10", isEvolving && "animate-pulse")}
        />

        <div className="absolute top-0 right-0">
          <div className="bg-card/80 backdrop-blur border border-border px-3 py-1 rounded-full text-xs font-mono font-bold shadow-sm">
            Lvl {plant.level}
          </div>
        </div>

        <div className="absolute top-0 left-0">
          <Link
            href="/ar"
            className="flex items-center gap-1.5 bg-card/80 backdrop-blur border border-border px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-sm hover:border-primary transition-colors"
          >
            <Camera size={14} /> AR
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border p-4 rounded-3xl shadow-lg mt-auto mb-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold font-sans tracking-tight">{plant.nickname || species?.name || "Unknown"}</h2>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">Stage {plant.stage} • {species?.rarity || "Common"}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-[10px] font-mono mb-1 text-muted-foreground">
            <span>XP</span>
            <span>{plant.xp} / {plant.level >= 20 ? "MAX" : xpForNextLevel}</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {evolutionReady ? (
          <Button 
            className="w-full h-14 text-lg font-bold shadow-[0_0_20px_rgba(var(--primary),0.5)] animate-pulse"
            onClick={handleEvolve}
            disabled={isEvolving}
          >
            <ArrowUpCircle className="mr-2" />
            EVOLVE
          </Button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {(Object.values(GROWTH_ACTIONS) as typeof GROWTH_ACTIONS[GrowthActionId][]).map((action) => {
              const canAfford = player.resources.water >= action.cost && player.resources.nutrients >= action.cost && player.resources.sunlight >= action.cost;
              return (
                <Button 
                  key={action.id}
                  variant={canAfford ? "default" : "secondary"}
                  disabled={!canAfford || isGrowing}
                  onClick={() => handleGrow(action.id)}
                  className="flex flex-col h-auto py-2 px-1 gap-1"
                >
                  <span className="font-bold text-sm">{action.label}</span>
                  <span className="text-[10px] font-mono opacity-80">-{action.cost} res</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Quick helper
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

import React from "react";
import { useGameStore } from "@/store/gameStore";
import { useSpecies } from "@/hooks/useContent";
import { Link } from "react-router-dom";
import { PlantVisual } from "@/components/plant-visual";
import { motion } from "framer-motion";

export default function Collection() {
  const player = useGameStore((s) => s.player);
  const { data: allSpecies = [], isLoading } = useSpecies();

  if (!player) return null;

  const discovered = player.discoveries.length;
  const total = allSpecies.length || 13;
  const pct = Math.min(100, (discovered / total) * 100);

  return (
    <div className="py-6 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-4">Collection</h1>

        <div className="bg-card border border-border rounded-3xl p-5 shadow-lg">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Species Discovered
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <motion.span
                  key={discovered}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  className="text-4xl font-bold font-sans text-primary leading-none"
                >
                  {discovered}
                </motion.span>
                <span className="text-lg font-mono text-muted-foreground">/ {total}</span>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-primary">{Math.round(pct)}%</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-20">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-card rounded-2xl animate-pulse" />
          ))
        ) : (
          allSpecies.map((species, i) => {
            const isDiscovered = player.discoveries.includes(species.slug);
            
            return (
              <Link key={species.slug} to={`/codex/${species.slug}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center border transition-all ${
                    isDiscovered 
                      ? "bg-card border-border hover:border-primary cursor-pointer hover:shadow-lg hover:shadow-primary/10" 
                      : "bg-muted/30 border-dashed border-border/50 opacity-60"
                  }`}
                >
                  <PlantVisual 
                    speciesSlug={species.slug}
                    stage={isDiscovered ? 4 : 4}
                    colors={{ primary: species.primaryColor, glow: species.rarityGlow }}
                    imageUrl={species.imageUrl}
                    className="w-20 h-20 mb-2"
                    isSilhouetted={!isDiscovered}
                  />
                  
                  <div className="mt-auto text-center w-full">
                    <h3 className="font-bold text-sm truncate">
                      {isDiscovered ? species.name : "Unknown"}
                    </h3>
                    <p className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase mt-0.5">
                      {isDiscovered && (
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: species.rarityColor || species.primaryColor || "hsl(var(--primary))" }}
                        />
                      )}
                      <span
                        className="truncate"
                        style={isDiscovered && species.rarityColor ? { color: species.rarityColor } : undefined}
                      >
                        {isDiscovered ? species.rarity : "???"}
                      </span>
                    </p>
                  </div>

                  {isDiscovered && (
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
                      style={{ backgroundColor: species.primaryColor || "var(--primary)" }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

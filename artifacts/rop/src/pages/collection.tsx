import React from "react";
import { useGameStore } from "@/store/gameStore";
import { useSpecies } from "@/hooks/useContent";
import { Link } from "wouter";
import { PlantVisual } from "@/components/plant-visual";
import { motion } from "framer-motion";

export default function Collection() {
  const player = useGameStore((s) => s.player);
  const { data: allSpecies = [], isLoading } = useSpecies();

  if (!player) return null;

  return (
    <div className="py-6 flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-sans tracking-tight">Codex</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {player.discoveries.length} / {allSpecies.length || "?"} Species Discovered
        </p>
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
              <Link key={species.slug} href={`/codex/${species.slug}`}>
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
                    <p className="text-[10px] font-mono text-muted-foreground uppercase">
                      {isDiscovered ? species.rarity : "???"}
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

import React from "react";
import { useParams, Link } from "wouter";
import { useSpeciesBySlug, useCodexBySlug } from "@/hooks/useContent";
import { useGameStore } from "@/store/gameStore";
import { PlantVisual } from "@/components/plant-visual";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Sword, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Codex() {
  const { slug } = useParams();
  const player = useGameStore((s) => s.player);
  
  const { data: species, isLoading: loadingSpecies } = useSpeciesBySlug(slug);
  const { data: codex, isLoading: loadingCodex } = useCodexBySlug(slug);

  const isDiscovered = player?.discoveries.includes(slug || "");

  if (loadingSpecies) {
    return <div className="p-6 text-center animate-pulse">Loading...</div>;
  }

  if (!species) {
    return <div className="p-6 text-center">Species not found</div>;
  }

  return (
    <div className="py-4 pb-24">
      <Link href="/collection" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Codex
      </Link>

      <div className="relative w-full aspect-square rounded-3xl mb-8 flex items-center justify-center overflow-hidden border border-border shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-card to-background z-0" />
        
        {isDiscovered && (
          <div 
            className="absolute inset-0 opacity-20 blur-3xl mix-blend-screen z-0"
            style={{ backgroundColor: species.primaryColor || "var(--primary)" }}
          />
        )}
        
        <PlantVisual 
          speciesSlug={species.slug}
          stage={4}
          colors={{ primary: species.primaryColor, glow: species.rarityGlow }}
          imageUrl={species.imageUrl}
          className="w-48 h-48 z-10"
          isSilhouetted={!isDiscovered}
        />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold font-sans tracking-tight mb-1">
            {isDiscovered ? species.name : "Unknown Species"}
          </h1>
          <div className="flex gap-2 font-mono text-xs uppercase tracking-wider">
            <span className="text-muted-foreground px-2 py-1 bg-muted rounded-md">
              {isDiscovered ? species.rarity : "???"}
            </span>
          </div>
        </div>

        {isDiscovered ? (
          <>
            <p className="text-foreground/80 leading-relaxed">
              {species.description || "No description available."}
            </p>

            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={<Sword size={16}/>} label="ATTACK" value={species.attack} />
              <StatCard icon={<Shield size={16}/>} label="DEFENSE" value={species.defense} />
              <StatCard icon={<Heart size={16}/>} label="HEALTH" value={species.health} />
            </div>

            {codex?.habitatDetails && (
              <div className="bg-card border border-border p-4 rounded-xl">
                <h3 className="font-bold text-sm mb-2 text-primary">Habitat</h3>
                <p className="text-sm text-muted-foreground">{codex.habitatDetails}</p>
              </div>
            )}
            
            {codex?.discoveryStory && (
              <div className="bg-card border border-border p-4 rounded-xl">
                <h3 className="font-bold text-sm mb-2 text-primary">Discovery</h3>
                <p className="text-sm text-muted-foreground italic">"{codex.discoveryStory}"</p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-card/50 border border-border/50 border-dashed p-6 rounded-xl text-center">
            <p className="text-muted-foreground text-sm italic mb-2">
              "{species.discoveryHint || "Rumored to exist somewhere..."}"
            </p>
            <p className="font-mono text-xs font-bold text-foreground">
              Continue exploring to discover this species.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card border border-border p-3 rounded-xl flex flex-col items-center justify-center text-center">
      <div className="text-muted-foreground mb-1">{icon}</div>
      <span className="font-mono font-bold text-lg">{value}</span>
      <span className="text-[9px] font-mono uppercase text-muted-foreground">{label}</span>
    </div>
  );
}

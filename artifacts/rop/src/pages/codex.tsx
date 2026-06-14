import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  useSpeciesBySlug,
  useCodexBySlug,
  useEvolutions,
  useSpecies,
} from "@/hooks/useContent";
import { useGameStore } from "@/store/gameStore";
import { PlantVisual } from "@/components/plant-visual";
import { ArrowLeft, Shield, Sword, Heart, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

const loreComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    h3: ({ children }) => (
      <h4 className="font-bold text-foreground">{children}</h4>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export default function Codex() {
  const { slug } = useParams();
  const player = useGameStore((s) => s.player);

  const { data: species, isLoading: loadingSpecies } = useSpeciesBySlug(slug);
  const { data: codex } = useCodexBySlug(slug);
  const { data: evolutions = [] } = useEvolutions();
  const { data: allSpecies = [] } = useSpecies();

  const isDiscovered = player?.discoveries.includes(slug || "");

  const evolvesTo = evolutions
    .filter((e) => e.from === slug)
    .map((e) => ({
      ...e,
      name: allSpecies.find((s) => s.slug === e.to)?.name || e.to,
      discovered: player?.discoveries.includes(e.to),
    }));

  if (loadingSpecies) {
    return <div className="p-6 text-center animate-pulse">Loading...</div>;
  }

  if (!species) {
    return <div className="p-6 text-center">Species not found</div>;
  }

  return (
    <div className="py-4 pb-24">
      <Link to="/collection" className="inline-flex items-center text-sm font-mono text-muted-foreground hover:text-foreground mb-6 transition-colors">
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
          <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wider">
            <span
              className="px-2.5 py-1 rounded-md border font-bold"
              style={
                isDiscovered && species.rarityColor
                  ? {
                      color: species.rarityColor,
                      borderColor: species.rarityColor,
                      backgroundColor: `color-mix(in srgb, ${species.rarityColor} 12%, transparent)`,
                    }
                  : undefined
              }
            >
              {isDiscovered ? species.rarity : "???"}
            </span>
            {isDiscovered && species.habitat && (
              <span className="text-muted-foreground px-2.5 py-1 bg-muted rounded-md">
                {species.habitat}
              </span>
            )}
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

            {evolvesTo.length > 0 && (
              <div className="bg-card border border-border p-4 rounded-xl">
                <h3 className="font-bold text-sm mb-3 text-primary">Evolution</h3>
                <div className="space-y-2">
                  {evolvesTo.map((e) => (
                    <motion.div
                      key={e.to}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-2"
                    >
                      <Link
                        to={`/codex/${e.to}`}
                        className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
                      >
                        <ArrowUpRight size={15} className="text-primary shrink-0" />
                        {e.discovered ? e.name : "Unknown form"}
                      </Link>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">
                        Lvl {e.requiredLevel}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {codex?.lore && codex.lore.length > 0 && (
              <div className="bg-card border border-border p-4 rounded-xl">
                <h3 className="font-bold text-sm mb-2 text-primary">Lore</h3>
                <div className="text-sm text-foreground/80 space-y-3">
                  <PortableText
                    value={codex.lore as unknown as React.ComponentProps<typeof PortableText>["value"]}
                    components={loreComponents}
                  />
                </div>
              </div>
            )}

            {(codex?.habitatDetails || species.habitat) && (
              <div className="bg-card border border-border p-4 rounded-xl">
                <h3 className="font-bold text-sm mb-2 text-primary">Habitat</h3>
                <p className="text-sm text-muted-foreground">{codex?.habitatDetails || species.habitat}</p>
              </div>
            )}

            {codex?.botanicalNotes && (
              <div className="bg-card border border-border p-4 rounded-xl">
                <h3 className="font-bold text-sm mb-2 text-primary">Botanical Notes</h3>
                <p className="text-sm text-muted-foreground">{codex.botanicalNotes}</p>
              </div>
            )}

            {codex?.discoveryStory && (
              <div className="bg-card border border-border p-4 rounded-xl">
                <h3 className="font-bold text-sm mb-2 text-primary">Discovery</h3>
                <p className="text-sm text-muted-foreground italic">"{codex.discoveryStory}"</p>
              </div>
            )}

            {codex?.hiddenFact && (
              <div className="bg-accent/10 border border-accent/30 p-4 rounded-xl">
                <h3 className="font-bold text-sm mb-2 text-accent flex items-center gap-1.5">
                  <Sparkles size={14} /> Hidden Fact
                </h3>
                <p className="text-sm text-foreground/80">{codex.hiddenFact}</p>
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

        <p className="pt-2 text-center text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60">
          Content dynamically powered by Sanity
        </p>
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

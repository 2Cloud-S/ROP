import React, { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlantVisual } from "@/components/plant-visual";
import { Shield, Sword, Zap, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BattleAction } from "@workspace/game-core";

export default function Battle() {
  const { player, battle, battleRewards, startBattle, battleAction, endBattle } = useGameStore();
  const { toast } = useToast();
  const [isActing, setIsActing] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up battle state on unmount if left
      endBattle();
    };
  }, []);

  if (!player) return null;

  const handleStart = async () => {
    setStarting(true);
    try {
      await startBattle();
    } catch (e: any) {
      toast({ title: "Failed to start battle", description: e.message, variant: "destructive" });
    } finally {
      setStarting(false);
    }
  };

  const handleAction = async (action: BattleAction) => {
    setIsActing(true);
    try {
      await battleAction(action);
    } catch (e: any) {
      toast({ title: "Action failed", description: e.message, variant: "destructive" });
    } finally {
      setIsActing(false);
    }
  };

  if (battleRewards && battle?.status !== "active") {
    const isWin = battleRewards.outcome === "won";
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border p-8 rounded-3xl shadow-2xl w-full"
        >
          <h2 className={`text-4xl font-bold font-sans mb-2 ${isWin ? 'text-primary' : 'text-destructive'}`}>
            {isWin ? "VICTORY" : "DEFEAT"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isWin ? "The rival flora retreats." : "Your plant needs to rest."}
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-background rounded-xl p-4 border border-border font-mono text-sm">
              <div className="text-accent mb-1">+{battleRewards.xp} XP</div>
              {battleRewards.resources && (
                <div className="text-foreground">
                  +{battleRewards.resources.water} Water, {battleRewards.resources.nutrients} Nutr, {battleRewards.resources.sunlight} Sun
                </div>
              )}
            </div>
            {battleRewards.newlyDiscovered && battleRewards.discovered && (
              <div className="bg-primary/20 text-primary border border-primary/30 rounded-xl p-4 font-bold text-sm">
                New Species Discovered: {battleRewards.discovered.name}!
              </div>
            )}
          </div>

          <Button size="lg" className="w-full font-bold tracking-widest" onClick={endBattle}>
            RETURN TO GARDEN
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="flex-1 flex flex-col p-6 items-center justify-center text-center">
        <div className="w-32 h-32 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6 border border-destructive/20 shadow-[0_0_30px_rgba(var(--destructive),0.2)]">
          <Sword size={48} />
        </div>
        <h1 className="text-3xl font-bold font-sans mb-2">Wild Flora</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Test your botanical strength against untamed species to earn resources and rare discoveries.
        </p>
        <Button 
          size="lg" 
          variant="destructive" 
          className="w-full font-bold tracking-widest h-14 text-lg"
          onClick={handleStart}
          disabled={starting || player.plants.length === 0}
        >
          {starting ? "SEARCHING..." : "ENTER BATTLE"}
        </Button>
      </div>
    );
  }

  const p = battle.player;
  const e = battle.enemy;
  const lastLog = battle.log[battle.log.length - 1];

  return (
    <div className="flex-1 flex flex-col py-4 pb-20">
      {/* Enemy */}
      <div className="flex flex-col items-center mb-auto pt-4">
        <div className="w-full max-w-[200px] mb-2">
          <div className="flex justify-between font-mono text-[10px] mb-1 px-1 text-muted-foreground uppercase">
            <span>{e.name} <span className="opacity-50">Lvl {e.level}</span></span>
            <span>{e.hp}/{e.maxHp}</span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border">
            <motion.div 
              className="h-full bg-destructive"
              animate={{ width: `${(e.hp / e.maxHp) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <PlantVisual 
          speciesSlug={e.speciesSlug}
          stage={4} // Enemeis always look mature
          colors={{ primary: "hsl(var(--destructive))", glow: "hsl(var(--destructive))" }}
          className="w-32 h-32 scale-x-[-1]" // flip enemy
        />
      </div>

      {/* Battle Log Area */}
      <div className="h-24 bg-card/50 border-y border-border flex items-center justify-center p-4 text-center my-4 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {lastLog ? (
            <motion.p 
              key={lastLog.turn + lastLog.actor}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-mono text-sm"
            >
              <span className={lastLog.actor === "player" ? "text-primary" : "text-destructive"}>
                {lastLog.actor === "player" ? "You" : "Enemy"} 
              </span>
              {" "}{lastLog.message}
            </motion.p>
          ) : (
            <motion.p className="text-muted-foreground font-mono text-sm italic">
              Battle commenced.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Player */}
      <div className="flex flex-col items-center mt-auto pb-4">
        <PlantVisual 
          speciesSlug={p.speciesSlug}
          stage={4}
          colors={{ primary: "hsl(var(--primary))", glow: "hsl(var(--primary))" }}
          className="w-40 h-40 mb-4"
        />
        <div className="w-full">
          <div className="flex justify-between font-mono text-[10px] mb-1 px-1 uppercase font-bold">
            <span>{p.name} <span className="text-muted-foreground">Lvl {p.level}</span></span>
            <span className="text-primary">{p.hp}/{p.maxHp}</span>
          </div>
          <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border">
            <motion.div 
              className="h-full bg-primary"
              animate={{ width: `${(p.hp / p.maxHp) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <Button 
          variant="outline" 
          className="h-14 font-bold flex flex-col gap-1 border-primary/50 hover:bg-primary hover:text-primary-foreground"
          onClick={() => handleAction("attack")}
          disabled={isActing || battle.status !== "active"}
        >
          <Sword size={16} />
          <span className="text-[10px]">ATTACK</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-14 font-bold flex flex-col gap-1 border-secondary/50"
          onClick={() => handleAction("defend")}
          disabled={isActing || battle.status !== "active"}
        >
          <Shield size={16} />
          <span className="text-[10px]">DEFEND</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-14 font-bold flex flex-col gap-1 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
          onClick={() => handleAction("special")}
          disabled={isActing || battle.status !== "active"}
        >
          <Zap size={16} />
          <span className="text-[10px]">SPECIAL</span>
        </Button>
      </div>
    </div>
  );
}

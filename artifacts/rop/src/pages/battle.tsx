import React, { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlantVisual } from "@/components/plant-visual";
import { Shield, Sword, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import type { BattleAction } from "@workspace/game-core";

/** Small radial particle burst used on the victory screen. */
function VictoryParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 22 }).map((_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const dist = 90 + Math.random() * 140;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-primary"
            style={{ boxShadow: "0 0 8px hsl(var(--primary))" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 1.2 + Math.random() * 0.5, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export default function Battle() {
  const { player, battle, battleRewards, startBattle, battleAction, endBattle } = useGameStore();
  const { toast } = useToast();
  const [isActing, setIsActing] = useState(false);
  const [starting, setStarting] = useState(false);

  // Hit-feedback state derived from authoritative HP changes.
  const [enemyHit, setEnemyHit] = useState(0);
  const [playerHit, setPlayerHit] = useState(0);
  const [enemyDmg, setEnemyDmg] = useState<number | null>(null);
  const [playerDmg, setPlayerDmg] = useState<number | null>(null);
  const prevEnemyHp = useRef<number | null>(null);
  const prevPlayerHp = useRef<number | null>(null);
  const enemyShake = useAnimationControls();
  const playerShake = useAnimationControls();

  const enemyHp = battle?.enemy.hp;
  const playerHp = battle?.player.hp;

  useEffect(() => {
    if (!battle) {
      prevEnemyHp.current = null;
      prevPlayerHp.current = null;
      return;
    }
    const eHp = battle.enemy.hp;
    const pHp = battle.player.hp;
    if (prevEnemyHp.current !== null && eHp < prevEnemyHp.current) {
      setEnemyDmg(prevEnemyHp.current - eHp);
      setEnemyHit((h) => h + 1);
      enemyShake.start({ x: [0, -7, 7, -5, 5, 0], transition: { duration: 0.4 } });
    }
    if (prevPlayerHp.current !== null && pHp < prevPlayerHp.current) {
      setPlayerDmg(prevPlayerHp.current - pHp);
      setPlayerHit((h) => h + 1);
      playerShake.start({ x: [0, -7, 7, -5, 5, 0], transition: { duration: 0.4 } });
    }
    prevEnemyHp.current = eHp;
    prevPlayerHp.current = pHp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enemyHp, playerHp]);

  useEffect(() => {
    if (enemyDmg === null) return;
    const t = setTimeout(() => setEnemyDmg(null), 750);
    return () => clearTimeout(t);
  }, [enemyDmg, enemyHit]);

  useEffect(() => {
    if (playerDmg === null) return;
    const t = setTimeout(() => setPlayerDmg(null), 750);
    return () => clearTimeout(t);
  }, [playerDmg, playerHit]);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      // Clean up battle state on unmount if left
      mountedRef.current = false;
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
      // If the user navigated away mid-action, re-clear any battle state the
      // late-resolving response may have re-populated in the store.
      if (!mountedRef.current) {
        endBattle();
        return;
      }
    } catch (e: any) {
      if (mountedRef.current) {
        toast({ title: "Action failed", description: e.message, variant: "destructive" });
      }
    } finally {
      if (mountedRef.current) setIsActing(false);
    }
  };

  if (battleRewards && battle?.status !== "active") {
    const isWin = battleRewards.outcome === "won";
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-card border border-border p-8 rounded-3xl shadow-2xl w-full overflow-hidden"
        >
          {isWin && <VictoryParticles />}
          <motion.h2
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
            className={`relative z-10 text-4xl font-bold font-sans mb-2 ${isWin ? "text-primary" : "text-destructive"}`}
          >
            {isWin ? "VICTORY" : "DEFEAT"}
          </motion.h2>
          <p className="relative z-10 text-muted-foreground mb-6">
            {isWin ? "The rival flora retreats." : "Your plant needs to rest."}
          </p>

          {battleRewards.newlyDiscovered && battleRewards.discovered && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 mb-6 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.35 }}
              >
                <PlantVisual
                  speciesSlug={battleRewards.discovered.slug}
                  stage={4}
                  colors={{
                    primary: battleRewards.discovered.primaryColor,
                    glow: battleRewards.discovered.rarityGlow,
                  }}
                  imageUrl={battleRewards.discovered.imageUrl}
                  className="w-32 h-32"
                />
              </motion.div>
              <div className="mt-2 flex items-center gap-1.5 text-primary font-bold text-sm">
                <Sparkles size={14} /> New Species: {battleRewards.discovered.name}
              </div>
            </motion.div>
          )}

          <div className="relative z-10 space-y-4 mb-8">
            <div className="bg-background rounded-xl p-4 border border-border font-mono text-sm">
              <div className="text-accent mb-1">+{battleRewards.xp} XP</div>
              {battleRewards.resources && (
                <div className="text-foreground">
                  +{battleRewards.resources.water} Water, {battleRewards.resources.nutrients} Nutr, {battleRewards.resources.sunlight} Sun
                </div>
              )}
            </div>
          </div>

          <Button size="lg" className="relative z-10 w-full font-bold tracking-widest" onClick={endBattle}>
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
        <motion.div animate={enemyShake} className="relative">
          <AnimatePresence>
            {enemyDmg !== null && (
              <motion.div
                key={enemyHit}
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: 1, y: -36, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 -translate-x-1/2 top-2 z-20 font-mono font-bold text-destructive text-xl pointer-events-none"
              >
                -{enemyDmg}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            key={`flash-${enemyHit}`}
            initial={{ opacity: enemyHit ? 0.5 : 0 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-destructive/50 rounded-full blur-md mix-blend-screen pointer-events-none"
          />
          <PlantVisual
            speciesSlug={e.speciesSlug}
            stage={4}
            colors={{ primary: "hsl(var(--destructive))", glow: "hsl(var(--destructive))" }}
            className="w-32 h-32 scale-x-[-1]"
          />
        </motion.div>
      </div>

      {/* Battle Log Area */}
      <div className="h-24 bg-card/50 border-y border-border flex flex-col items-center justify-center p-4 text-center my-4 overflow-hidden relative">
        {lastLog && (
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground/60">
            Turn {lastLog.turn}
          </span>
        )}
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
        <motion.div animate={playerShake} className="relative">
          <AnimatePresence>
            {playerDmg !== null && (
              <motion.div
                key={playerHit}
                initial={{ opacity: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: 1, y: -36, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 -translate-x-1/2 top-2 z-20 font-mono font-bold text-destructive text-xl pointer-events-none"
              >
                -{playerDmg}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            key={`pflash-${playerHit}`}
            initial={{ opacity: playerHit ? 0.5 : 0 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-destructive/50 rounded-full blur-md mix-blend-screen pointer-events-none"
          />
          <PlantVisual
            speciesSlug={p.speciesSlug}
            stage={4}
            colors={{ primary: "hsl(var(--primary))", glow: "hsl(var(--primary))" }}
            className="w-40 h-40 mb-4"
          />
        </motion.div>
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

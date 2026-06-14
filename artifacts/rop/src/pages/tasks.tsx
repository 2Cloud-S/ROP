import React, { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useTasks } from "@/hooks/useContent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ResourceBar } from "@/components/resource-bar";
import { Droplets, Sprout, Sun, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TASK_REWARDS } from "@workspace/game-core";

export default function Tasks() {
  const player = useGameStore((s) => s.player);
  const completeTask = useGameStore((s) => s.completeTask);
  const { data: tasks = [], isLoading } = useTasks();
  const { toast } = useToast();
  const [completingId, setCompletingId] = useState<string | null>(null);

  if (!player) return null;

  const handleComplete = async (taskId: string) => {
    setCompletingId(taskId);
    try {
      const res = await completeTask(taskId);
      toast({
        title: "Task Completed!",
        description: `Earned +${res.reward.amount} ${res.reward.kind}`,
      });
      if (res.newlyDiscovered) {
        setTimeout(() => toast({ title: "New Species Discovered!", description: res.discovered?.name }), 1000);
      }
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setCompletingId(null);
    }
  };

  const getRewardIcon = (kind: string) => {
    switch (kind) {
      case "water": return <Droplets className="text-blue-400" size={16} />;
      case "nutrients": return <Sprout className="text-green-400" size={16} />;
      case "sunlight": return <Sun className="text-yellow-400" size={16} />;
      default: return <Sparkles className="text-primary" size={16} />;
    }
  };

  return (
    <div className="py-6 flex flex-col h-full">
      <ResourceBar />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-sans tracking-tight">Rituals</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Complete real-world tasks to earn resources.
        </p>
      </div>

      <div className="space-y-4 pb-20">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />
          ))
        ) : tasks.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No tasks available right now.
          </div>
        ) : (
          tasks.map((task, i) => {
            const lastDoneStr = player.lastTaskAt[task.id];
            const lastDone = lastDoneStr ? new Date(lastDoneStr).getTime() : 0;
            const rewardDef = TASK_REWARDS[task.id];
            const cooldownHours = rewardDef?.cooldownHours || 0;
            const cooldownMs = cooldownHours * 60 * 60 * 1000;
            const now = Date.now();
            const timeSince = now - lastDone;
            const isOnCooldown = timeSince < cooldownMs;
            
            let cooldownRemaining = "";
            if (isOnCooldown) {
              const msLeft = cooldownMs - timeSince;
              const hrs = Math.floor(msLeft / (1000 * 60 * 60));
              const mins = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
              cooldownRemaining = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
            }

            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={task.id} 
                className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm"
              >
                <div className="flex-1 pr-4">
                  <h3 className="font-bold font-sans text-lg mb-1">{task.title}</h3>
                  {task.description && (
                    <p className="text-xs text-muted-foreground leading-snug mb-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 bg-background border border-border w-fit px-2 py-1 rounded-md">
                    {rewardDef && getRewardIcon(rewardDef.kind)}
                    <span className="font-mono text-xs font-bold">
                      +{rewardDef?.amount || 0} {rewardDef?.kind}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleComplete(task.id)}
                  disabled={isOnCooldown || completingId === task.id}
                  variant={isOnCooldown ? "secondary" : "default"}
                  className={`h-12 w-12 rounded-xl shrink-0 p-0 ${!isOnCooldown && "shadow-[0_0_15px_rgba(var(--primary),0.3)]"}`}
                >
                  {isOnCooldown ? (
                    <div className="flex flex-col items-center">
                      <Clock size={16} className="mb-0.5 opacity-50" />
                      <span className="text-[9px] font-mono">{cooldownRemaining}</span>
                    </div>
                  ) : completingId === task.id ? (
                    <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  ) : (
                    <CheckCircle2 size={24} />
                  )}
                </Button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}


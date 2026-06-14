import React from "react";
import { useGameStore } from "@/store/gameStore";
import { Droplets, Sprout, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ResourceBar() {
  const player = useGameStore((s) => s.player);
  if (!player) return null;

  const { water, nutrients, sunlight } = player.resources;

  return (
    <div className="flex items-center justify-between bg-card/50 backdrop-blur-md rounded-2xl p-3 border border-border shadow-sm mb-4">
      <ResourceItem icon={<Droplets className="text-blue-400" size={18} />} value={water} />
      <div className="w-px h-6 bg-border/50" />
      <ResourceItem icon={<Sprout className="text-green-400" size={18} />} value={nutrients} />
      <div className="w-px h-6 bg-border/50" />
      <ResourceItem icon={<Sun className="text-yellow-400" size={18} />} value={sunlight} />
    </div>
  );
}

function ResourceItem({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <motion.span 
        key={value}
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-mono font-medium text-sm"
      >
        {value}
      </motion.span>
    </div>
  );
}

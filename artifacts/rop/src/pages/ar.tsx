import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useSpeciesBySlug } from "@/hooks/useContent";
import { PlantVisual } from "@/components/plant-visual";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

export default function AR() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const plant = useGameStore((s) => s.activePlant());
  const { data: species } = useSpeciesBySlug(plant?.speciesSlug);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err: any) {
        setHasPermission(false);
        setError(err.message || "Camera access denied");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!plant) {
    return <div className="p-6 text-center">No active plant to project.</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {hasPermission === false && (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-card p-6 rounded-xl border border-border">
            <Camera className="mx-auto mb-4 text-muted-foreground w-12 h-12" />
            <h2 className="text-xl font-bold mb-2">Camera Required</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {hasPermission && (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        {hasPermission && (
          <PlantVisual 
            speciesSlug={plant.speciesSlug}
            stage={plant.stage}
            colors={{ primary: species?.primaryColor, glow: species?.rarityGlow }}
            imageUrl={species?.imageUrl}
            className="w-80 h-80 drop-shadow-2xl filter"
          />
        )}
      </div>

      <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center p-4">
        <Button 
          variant="secondary" 
          size="lg"
          className="rounded-full shadow-2xl backdrop-blur-md bg-background/50 border border-border"
          onClick={() => window.history.back()}
        >
          <X className="mr-2" /> Exit AR
        </Button>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useSpeciesBySlug } from "@/hooks/useContent";
import { PlantVisual } from "@/components/plant-visual";
import { Button } from "@/components/ui/button";
import {
  Camera,
  X,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Aperture,
  Download,
} from "lucide-react";

export default function AR() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const plantWrapRef = useRef<HTMLDivElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [shotUrl, setShotUrl] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const plant = useGameStore((s) => s.activePlant());
  const { data: species } = useSpeciesBySlug(plant?.speciesSlug);

  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 4500);
    return () => clearTimeout(t);
  }, [showHint]);

  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setHasPermission(true);
      } catch (err: any) {
        if (cancelled) return;
        setHasPermission(false);
        setError(err?.message || "Camera access denied");
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // The <video> element is only mounted once `hasPermission` is true, so the
  // stream must be attached here — not inside startCamera, where videoRef is
  // still null and srcObject would silently never be set (black screen).
  useEffect(() => {
    const video = videoRef.current;
    if (hasPermission && streamRef.current && video) {
      video.srcObject = streamRef.current;
      video.play().catch(() => {});
    }
  }, [hasPermission]);

  useEffect(() => {
    return () => {
      if (shotUrl) URL.revokeObjectURL(shotUrl);
    };
  }, [shotUrl]);

  async function rasterizePlant(): Promise<HTMLImageElement | null> {
    const node = plantWrapRef.current;
    if (!node) return null;

    const imgEl = node.querySelector("img");
    if (imgEl && imgEl.src) {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.src = imgEl.src;
      try {
        await im.decode();
      } catch {
        /* fall through – image may still draw */
      }
      return im;
    }

    const svgEl = node.querySelector("svg");
    if (svgEl) {
      const clone = svgEl.cloneNode(true) as SVGElement;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const xml = new XMLSerializer().serializeToString(clone);
      const svg64 =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
      const im = new Image();
      im.src = svg64;
      try {
        await im.decode();
      } catch {
        /* ignore */
      }
      return im;
    }

    return null;
  }

  async function handleScreenshot() {
    const video = videoRef.current;
    if (!video) return;

    const w = video.videoWidth || video.clientWidth || 720;
    const h = video.videoHeight || video.clientHeight || 1280;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);

    const plantImg = await rasterizePlant();
    if (plantImg) {
      const baseSize = Math.min(w, h) * 0.55 * scale;
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(plantImg, -baseSize / 2, -baseSize / 2, baseSize, baseSize);
      ctx.restore();
    }

    // Watermark: species name + game title.
    const pad = Math.round(Math.min(w, h) * 0.045);
    const nameSize = Math.round(Math.min(w, h) * 0.055);
    const tagSize = Math.round(Math.min(w, h) * 0.032);
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = Math.round(nameSize * 0.3);
    if (species?.name) {
      ctx.font = `700 ${nameSize}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(species.name, pad, h - pad - tagSize * 1.4);
    }
    ctx.font = `600 ${tagSize}px ui-monospace, monospace`;
    ctx.fillStyle = "rgba(120, 230, 170, 0.95)";
    ctx.fillText("RISE OF THE PLANTS", pad, h - pad);
    ctx.restore();

    // Capture flash feedback.
    setFlash(true);
    setTimeout(() => setFlash(false), 220);

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setShotUrl(url);
      }, "image/png");
    } catch {
      setError("Could not capture screenshot on this device.");
    }
  }

  function downloadShot() {
    if (!shotUrl) return;
    const a = document.createElement("a");
    a.href = shotUrl;
    a.download = `rise-of-the-plants-${Date.now()}.png`;
    a.click();
  }

  if (!plant) {
    return <div className="p-6 text-center">No active plant to project.</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {hasPermission === null && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <Camera className="absolute inset-0 m-auto text-primary w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold font-sans mb-1">Starting camera…</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Allow camera access to project your plant into the real world.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-6 text-muted-foreground"
            onClick={() => window.history.back()}
          >
            <X className="mr-2" size={16} /> Cancel
          </Button>
        </div>
      )}

      {hasPermission === false && (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-card p-6 rounded-xl border border-border max-w-sm">
            <Camera className="mx-auto mb-4 text-muted-foreground w-12 h-12" />
            <h2 className="text-xl font-bold mb-2">Camera Required</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {error || "Enable camera access to view your plant in AR."}
            </p>
            <Button variant="secondary" onClick={() => window.history.back()}>
              <X className="mr-2" size={16} /> Go Back
            </Button>
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
          <div
            ref={plantWrapRef}
            style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}
            className="transition-transform duration-150 ease-out"
          >
            <PlantVisual
              speciesSlug={plant.speciesSlug}
              stage={plant.stage}
              colors={{ primary: species?.primaryColor, glow: species?.rarityGlow }}
              imageUrl={species?.imageUrl}
              className="w-72 h-72 drop-shadow-2xl filter"
            />
          </div>
        )}
      </div>

      {/* Placement instructions hint */}
      {hasPermission && showHint && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-4 w-full max-w-sm pointer-events-none">
          <div className="bg-background/60 backdrop-blur-md border border-border rounded-2xl px-4 py-3 text-center shadow-2xl animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-bold">Point at a flat surface</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rotate &amp; zoom to place your plant, then tap the shutter to capture.
            </p>
          </div>
        </div>
      )}

      {/* Capture flash */}
      {flash && (
        <div className="absolute inset-0 z-40 bg-white pointer-events-none animate-out fade-out duration-200" />
      )}

      {/* Controls */}
      {hasPermission && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md border border-border rounded-full p-1.5 shadow-2xl">
            <ControlButton
              label="Rotate left"
              onClick={() => setRotation((r) => r - 15)}
            >
              <RotateCcw size={20} />
            </ControlButton>
            <ControlButton
              label="Shrink"
              onClick={() => setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2)))}
            >
              <ZoomOut size={20} />
            </ControlButton>
            <button
              aria-label="Take screenshot"
              onClick={handleScreenshot}
              className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/40 active:scale-95 transition-transform"
            >
              <Aperture size={26} />
            </button>
            <ControlButton
              label="Enlarge"
              onClick={() => setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)))}
            >
              <ZoomIn size={20} />
            </ControlButton>
            <ControlButton
              label="Rotate right"
              onClick={() => setRotation((r) => r + 15)}
            >
              <RotateCw size={20} />
            </ControlButton>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="rounded-full backdrop-blur-md bg-background/50 border border-border"
            onClick={() => window.history.back()}
          >
            <X className="mr-2" size={16} /> Exit AR
          </Button>
        </div>
      )}

      {/* Screenshot preview */}
      {shotUrl && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
          <p className="text-sm font-mono text-muted-foreground mb-3">
            Screenshot captured
          </p>
          <img
            src={shotUrl}
            alt="AR screenshot"
            className="max-h-[60vh] w-auto rounded-xl border border-border shadow-2xl mb-5"
          />
          <div className="flex gap-3">
            <Button onClick={downloadShot}>
              <Download className="mr-2" size={16} /> Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (shotUrl) URL.revokeObjectURL(shotUrl);
                setShotUrl(null);
              }}
            >
              <X className="mr-2" size={16} /> Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="h-11 w-11 rounded-full bg-background/60 border border-border text-foreground flex items-center justify-center active:scale-95 transition-transform"
    >
      {children}
    </button>
  );
}

"use client";
import { useRef, useState } from "react";
import { SuitSVG, SuitColors, GraphicPattern } from "./SuitSVG";

export default function SuitPreview3D({
  colors,
  pattern,
  logoUrl,
  logoTransform,
  backLogoUrl,
  backLogoTransform,
}: {
  colors: SuitColors;
  pattern?: GraphicPattern;
  logoUrl: string | null;
  logoTransform: { x: number; y: number; scale: number; rotate: number };
  backLogoUrl: string | null;
  backLogoTransform: { x: number; y: number; scale: number; rotate: number };
}) {
  const [rotY, setRotY] = useState(20);
  const [zoom, setZoom] = useState(1);
  const dragging = useRef(false);
  const lastX = useRef(0);

  function start(clientX: number) {
    dragging.current = true;
    lastX.current = clientX;
  }
  function move(clientX: number) {
    if (!dragging.current) return;
    const delta = clientX - lastX.current;
    lastX.current = clientX;
    setRotY((r) => r + delta * 0.6);
  }
  function end() {
    dragging.current = false;
  }

  return (
    <div className="select-none">
      <div
        className="relative mx-auto cursor-grab active:cursor-grabbing"
        style={{ width: 240, height: 350, perspective: 1000 }}
        onMouseDown={(e) => start(e.clientX)}
        onMouseMove={(e) => move(e.clientX)}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={(e) => start(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
        onTouchEnd={end}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${zoom}) rotateY(${rotY}deg)`,
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <SuitSVG colors={colors} pattern={pattern} view="front" logoUrl={logoUrl} logoTransform={logoTransform} className="w-full h-full drop-shadow-2xl" />
          </div>
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <SuitSVG colors={colors} view="back" logoUrl={backLogoUrl} logoTransform={backLogoTransform} className="w-full h-full drop-shadow-2xl" />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mt-5">
        <button
          onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
          className="w-8 h-8 border border-white/20 text-creamDim hover:border-gold hover:text-gold transition-colors"
        >
          −
        </button>
        <button
          onClick={() => setRotY((r) => r + 180)}
          className="text-xs uppercase tracking-widest text-creamDim border border-white/20 px-4 py-2 hover:border-gold hover:text-gold transition-colors"
        >
          Flip
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
          className="w-8 h-8 border border-white/20 text-creamDim hover:border-gold hover:text-gold transition-colors"
        >
          +
        </button>
      </div>
      <p className="text-center text-xs text-creamDim mt-3">Drag left/right to rotate · use +/− to zoom</p>
    </div>
  );
}

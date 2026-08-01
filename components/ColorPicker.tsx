"use client";
import { useEffect, useState } from "react";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function ColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (hex: string) => void;
}) {
  const [hexInput, setHexInput] = useState(color);
  const [rgb, setRgb] = useState<[number, number, number]>(hexToRgb(color));
  const [eyedropperSupported, setEyedropperSupported] = useState(false);

  useEffect(() => {
    setHexInput(color);
    setRgb(hexToRgb(color));
  }, [color]);

  useEffect(() => {
    setEyedropperSupported(typeof window !== "undefined" && "EyeDropper" in window);
  }, []);

  function commitHex(value: string) {
    setHexInput(value);
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)) {
      onChange(value);
    }
  }

  function updateRgbChannel(index: 0 | 1 | 2, value: number) {
    const next: [number, number, number] = [...rgb];
    next[index] = value;
    setRgb(next);
    onChange(rgbToHex(...next));
  }

  async function useEyedropper() {
    try {
      // @ts-ignore — EyeDropper isn't in default TS lib yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      if (result?.sRGBHex) onChange(result.sRGBHex);
    } catch {
      // user cancelled — no-op
    }
  }

  return (
    <div className="border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded border-2 border-white/20 flex-shrink-0"
          style={{ background: color }}
        />
        <div className="flex-1">
          <label className="block text-[10px] uppercase text-creamDim mb-1">Hex</label>
          <input
            value={hexInput}
            onChange={(e) => commitHex(e.target.value)}
            spellCheck={false}
            className="w-full bg-black border border-white/15 px-3 py-2 text-sm text-cream font-mono uppercase"
          />
        </div>
        {eyedropperSupported && (
          <button
            onClick={useEyedropper}
            title="Pick a color from anywhere on your screen"
            className="w-10 h-10 flex-shrink-0 border border-white/20 hover:border-gold hover:text-gold text-creamDim flex items-center justify-center text-lg"
          >
            💧
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {(["R", "G", "B"] as const).map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-creamDim w-4">{label}</span>
            <input
              type="range"
              min={0}
              max={255}
              value={rgb[i]}
              onChange={(e) => updateRgbChannel(i as 0 | 1 | 2, Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: label === "R" ? "#c8102e" : label === "G" ? "#3fae5e" : "#2f5bb8" }}
            />
            <span className="text-[10px] font-mono text-creamDim w-8 text-right">{rgb[i]}</span>
          </div>
        ))}
      </div>

      {!eyedropperSupported && (
        <p className="text-[10px] text-creamDim mt-3">
          Eyedropper tool works in Chrome/Edge — not supported in this browser.
        </p>
      )}
    </div>
  );
}

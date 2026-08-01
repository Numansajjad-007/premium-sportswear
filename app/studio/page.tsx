"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SuitSVG, SuitColors, GraphicPattern } from "@/components/SuitSVG";
import SuitPreview3D from "@/components/SuitPreview3D";
import ColorPicker from "@/components/ColorPicker";

const PANELS = [
  { id: "panelBase", label: "Body" },
  { id: "panelChest", label: "Chest" },
  { id: "panelShoulders", label: "Shoulders" },
  { id: "panelArms", label: "Arms" },
  { id: "panelCuffs", label: "Cuffs" },
  { id: "panelBelt", label: "Belt" },
  { id: "panelLegs", label: "Legs" },
  { id: "panelStripe", label: "Side Panels" },
  { id: "panelCollar", label: "Collar" },
];

const SWATCHES = [
  "#0a0a0b", "#1c1c1f", "#38383e", "#f2f1ee",
  "#c8102e", "#8c0d21", "#c6a15b", "#e0c07e",
  "#0d5c2f", "#1a7a3a", "#3fae5e", "#1c3d7a",
  "#2f5bb8", "#5b2c8a", "#d2691e", "#c9c9c9",
];

const TEMPLATES: { name: string; colors: SuitColors; pattern?: GraphicPattern }[] = [
  { name: "Classic Black & Gold", colors: { panelBase: "#1c1c1f", panelChest: "#141416", panelShoulders: "#c6a15b", panelArms: "#38383e", panelCuffs: "#0a0a0b", panelBelt: "#0a0a0b", panelLegs: "#1c1c1f", panelStripe: "#c8102e", panelCollar: "#c6a15b" } },
  { name: "Racing Green", colors: { panelBase: "#0a0a0b", panelChest: "#0d5c2f", panelShoulders: "#3fae5e", panelArms: "#0a0a0b", panelCuffs: "#3fae5e", panelBelt: "#1a7a3a", panelLegs: "#0a0a0b", panelStripe: "#3fae5e", panelCollar: "#3fae5e" } },
  { name: "Blue Storm", colors: { panelBase: "#0a0a0b", panelChest: "#1c3d7a", panelShoulders: "#f2f1ee", panelArms: "#1c3d7a", panelCuffs: "#f2f1ee", panelBelt: "#2f5bb8", panelLegs: "#0a0a0b", panelStripe: "#f2f1ee", panelCollar: "#2f5bb8" } },
  { name: "Carbon Stealth", colors: { panelBase: "#0a0a0b", panelChest: "#1c1c1f", panelShoulders: "#38383e", panelArms: "#1c1c1f", panelCuffs: "#38383e", panelBelt: "#0a0a0b", panelLegs: "#0a0a0b", panelStripe: "#c9c9c9", panelCollar: "#38383e" } },
  { name: "Red Inferno", colors: { panelBase: "#0a0a0b", panelChest: "#8c0d21", panelShoulders: "#c8102e", panelArms: "#0a0a0b", panelCuffs: "#c8102e", panelBelt: "#c8102e", panelLegs: "#0a0a0b", panelStripe: "#f2f1ee", panelCollar: "#c8102e" } },
  { name: "White Pearl", colors: { panelBase: "#f2f1ee", panelChest: "#c9c9c9", panelShoulders: "#1c1c1f", panelArms: "#f2f1ee", panelCuffs: "#1c1c1f", panelBelt: "#1c1c1f", panelLegs: "#f2f1ee", panelStripe: "#c8102e", panelCollar: "#1c1c1f" } },
  { name: "Team Purple", colors: { panelBase: "#0a0a0b", panelChest: "#5b2c8a", panelShoulders: "#e0c07e", panelArms: "#0a0a0b", panelCuffs: "#e0c07e", panelBelt: "#5b2c8a", panelLegs: "#0a0a0b", panelStripe: "#5b2c8a", panelCollar: "#e0c07e" } },
  { name: "Sunset Orange", colors: { panelBase: "#1c1c1f", panelChest: "#d2691e", panelShoulders: "#f2f1ee", panelArms: "#1c1c1f", panelCuffs: "#d2691e", panelBelt: "#0a0a0b", panelLegs: "#1c1c1f", panelStripe: "#d2691e", panelCollar: "#f2f1ee" } },
  { name: "Silver Line", colors: { panelBase: "#38383e", panelChest: "#1c1c1f", panelShoulders: "#c9c9c9", panelArms: "#38383e", panelCuffs: "#c9c9c9", panelBelt: "#1c1c1f", panelLegs: "#38383e", panelStripe: "#c9c9c9", panelCollar: "#c9c9c9" } },
  { name: "Deep Ocean", colors: { panelBase: "#0a0a0b", panelChest: "#1c3d7a", panelShoulders: "#2f5bb8", panelArms: "#1c3d7a", panelCuffs: "#0a0a0b", panelBelt: "#0a0a0b", panelLegs: "#0a0a0b", panelStripe: "#2f5bb8", panelCollar: "#2f5bb8" } },
  { name: "Gold Rush", colors: { panelBase: "#0a0a0b", panelChest: "#0a0a0b", panelShoulders: "#c6a15b", panelArms: "#0a0a0b", panelCuffs: "#c6a15b", panelBelt: "#c6a15b", panelLegs: "#0a0a0b", panelStripe: "#e0c07e", panelCollar: "#c6a15b" } },
  { name: "Forest Camo", colors: { panelBase: "#1c1c1f", panelChest: "#0d5c2f", panelShoulders: "#38383e", panelArms: "#0d5c2f", panelCuffs: "#1c1c1f", panelBelt: "#1a7a3a", panelLegs: "#1c1c1f", panelStripe: "#38383e", panelCollar: "#1a7a3a" } },
  { name: "Crimson & Carbon", colors: { panelBase: "#1c1c1f", panelChest: "#1c1c1f", panelShoulders: "#c8102e", panelArms: "#38383e", panelCuffs: "#c8102e", panelBelt: "#0a0a0b", panelLegs: "#1c1c1f", panelStripe: "#8c0d21", panelCollar: "#c8102e" } },
  { name: "Ice White & Blue", colors: { panelBase: "#f2f1ee", panelChest: "#f2f1ee", panelShoulders: "#2f5bb8", panelArms: "#c9c9c9", panelCuffs: "#2f5bb8", panelBelt: "#1c3d7a", panelLegs: "#f2f1ee", panelStripe: "#1c3d7a", panelCollar: "#2f5bb8" } },
  { name: "Amethyst Night", colors: { panelBase: "#0a0a0b", panelChest: "#0a0a0b", panelShoulders: "#5b2c8a", panelArms: "#0a0a0b", panelCuffs: "#5b2c8a", panelBelt: "#5b2c8a", panelLegs: "#0a0a0b", panelStripe: "#c9c9c9", panelCollar: "#5b2c8a" } },
  { name: "Emerald Edge", colors: { panelBase: "#1c1c1f", panelChest: "#1c1c1f", panelShoulders: "#3fae5e", panelArms: "#1c1c1f", panelCuffs: "#3fae5e", panelBelt: "#0d5c2f", panelLegs: "#1c1c1f", panelStripe: "#f2f1ee", panelCollar: "#3fae5e" } },

  // Genuinely different graphic patterns (not just recolors) — diagonal, blocks, blade, plain
  { name: "Blue Lightning", pattern: "diagonal", colors: { panelBase: "#f2f1ee", panelChest: "#f2f1ee", panelShoulders: "#1c3d7a", panelArms: "#f2f1ee", panelCuffs: "#1c1c1f", panelBelt: "#1c3d7a", panelLegs: "#f2f1ee", panelStripe: "#1c3d7a", panelCollar: "#2f5bb8" } },
  { name: "Angular Storm", pattern: "blocks", colors: { panelBase: "#f2f1ee", panelChest: "#f2f1ee", panelShoulders: "#0a0a0b", panelArms: "#f2f1ee", panelCuffs: "#0a0a0b", panelBelt: "#0a0a0b", panelLegs: "#f2f1ee", panelStripe: "#c8102e", panelCollar: "#0a0a0b" } },
  { name: "Speed Blade Red", pattern: "blade", colors: { panelBase: "#0a0a0b", panelChest: "#0a0a0b", panelShoulders: "#c8102e", panelArms: "#0a0a0b", panelCuffs: "#c8102e", panelBelt: "#c8102e", panelLegs: "#0a0a0b", panelStripe: "#c8102e", panelCollar: "#c8102e" } },
  { name: "Speed Blade Gold", pattern: "blade", colors: { panelBase: "#1c1c1f", panelChest: "#1c1c1f", panelShoulders: "#c6a15b", panelArms: "#1c1c1f", panelCuffs: "#c6a15b", panelBelt: "#0a0a0b", panelLegs: "#1c1c1f", panelStripe: "#c6a15b", panelCollar: "#c6a15b" } },
  { name: "Diagonal Fire", pattern: "diagonal", colors: { panelBase: "#0a0a0b", panelChest: "#0a0a0b", panelShoulders: "#d2691e", panelArms: "#0a0a0b", panelCuffs: "#d2691e", panelBelt: "#8c0d21", panelLegs: "#0a0a0b", panelStripe: "#d2691e", panelCollar: "#d2691e" } },
  { name: "Storm Grey Blocks", pattern: "blocks", colors: { panelBase: "#38383e", panelChest: "#38383e", panelShoulders: "#f2f1ee", panelArms: "#38383e", panelCuffs: "#1c1c1f", panelBelt: "#1c1c1f", panelLegs: "#38383e", panelStripe: "#c9c9c9", panelCollar: "#f2f1ee" } },
  { name: "Minimalist Black", pattern: "plain", colors: { panelBase: "#0a0a0b", panelChest: "#0a0a0b", panelShoulders: "#c6a15b", panelArms: "#0a0a0b", panelCuffs: "#c6a15b", panelBelt: "#0a0a0b", panelLegs: "#0a0a0b", panelStripe: "#0a0a0b", panelCollar: "#c6a15b" } },
  { name: "Minimalist White", pattern: "plain", colors: { panelBase: "#f2f1ee", panelChest: "#f2f1ee", panelShoulders: "#1c1c1f", panelArms: "#f2f1ee", panelCuffs: "#1c1c1f", panelBelt: "#f2f1ee", panelLegs: "#f2f1ee", panelStripe: "#f2f1ee", panelCollar: "#1c1c1f" } },
  { name: "Diagonal Emerald", pattern: "diagonal", colors: { panelBase: "#0a0a0b", panelChest: "#0a0a0b", panelShoulders: "#3fae5e", panelArms: "#0a0a0b", panelCuffs: "#3fae5e", panelBelt: "#0d5c2f", panelLegs: "#0a0a0b", panelStripe: "#3fae5e", panelCollar: "#3fae5e" } },
  { name: "Blade Purple Storm", pattern: "blade", colors: { panelBase: "#1c1c1f", panelChest: "#1c1c1f", panelShoulders: "#5b2c8a", panelArms: "#1c1c1f", panelCuffs: "#5b2c8a", panelBelt: "#0a0a0b", panelLegs: "#1c1c1f", panelStripe: "#5b2c8a", panelCollar: "#5b2c8a" } },
];

export default function StudioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("Loading product...");
  const [view, setView] = useState<"front" | "back">("front");
  const [activePanel, setActivePanel] = useState("panelBase");
  const [colors, setColors] = useState<SuitColors>(TEMPLATES[0].colors);
  const [pattern, setPattern] = useState<GraphicPattern>(TEMPLATES[0].pattern || "chevron");
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0].name);
  const [name, setName] = useState("Your Name");
  const [number, setNumber] = useState("07");
  const [flag, setFlag] = useState("#38383e");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoTransform, setLogoTransform] = useState({ x: 150, y: 65, scale: 1, rotate: 0 });
  const [backLogoUrl, setBackLogoUrl] = useState<string | null>(null);
  const [backLogoTransform, setBackLogoTransform] = useState({ x: 150, y: 60, scale: 1, rotate: 0 });
  const [saved, setSaved] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const slug = searchParams.get("product");
    const url = slug ? `/api/products?slug=${slug}` : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setProductId(data.id);
          setProductName(data.name);
        } else {
          setProductName("No product found — seed the database first.");
        }
      })
      .catch(() => setProductName("Couldn't load product."));
  }, [searchParams]);

  function setColor(hex: string) {
    setColors((c) => ({ ...c, [activePanel]: hex }));
    setActiveTemplate("Custom");
  }

  function applyTemplate(t: { name: string; colors: SuitColors; pattern?: GraphicPattern }) {
    setColors(t.colors);
    setPattern(t.pattern || "chevron");
    setActiveTemplate(t.name);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (view === "front") setLogoUrl(evt.target?.result as string);
      else setBackLogoUrl(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function svgPoint(clientX: number, clientY: number) {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }

  function updateActiveLogoTransform(updater: (t: typeof logoTransform) => typeof logoTransform) {
    if (view === "front") setLogoTransform(updater);
    else setBackLogoTransform(updater);
  }

  async function saveDesign(): Promise<string | null> {
    if (!session?.user) {
      router.push("/login");
      return null;
    }
    if (!productId) {
      alert("Still loading the product — try again in a second.");
      return null;
    }
    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: (session.user as any).id,
          productId,
          name: `${name} — #${number}`,
          panelColors: colors,
          logoUrl: logoUrl ?? undefined,
          logoTransform,
          driverName: name,
          raceNumber: number,
          flagColor: flag,
        }),
      });
      const data = await res.json();
      setSaved(true);
      return data?.id ?? null;
    } catch {
      alert("Something went wrong saving your design — try again.");
      return null;
    }
  }

  async function requestQuote() {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setQuoting(true);
    const designId = await saveDesign();
    if (!designId) {
      setQuoting(false);
      return;
    }
    try {
      await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: (session.user as any).id, designId, quantity: 1 }),
      });
      setQuoteSent(true);
    } catch {
      alert("Design was saved, but the quote request failed — try again.");
    } finally {
      setQuoting(false);
    }
  }

  const currentLogoUrl = view === "front" ? logoUrl : backLogoUrl;
  const currentLogoTransform = view === "front" ? logoTransform : backLogoTransform;
  const [show3D, setShow3D] = useState(false);

  return (
    <main className="bg-black min-h-screen pt-20 lg:grid lg:grid-cols-[220px_1fr_400px]">
      {/* LEFT — Uploads / quick links */}
      <aside className="hidden lg:flex flex-col border-r border-white/10 bg-carbon p-5 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto">
        <h5 className="font-mono text-xs uppercase text-gold tracking-widest mb-4">Your Logos</h5>

        <div className="mb-3">
          <p className="text-[10px] uppercase text-creamDim mb-1">Front</p>
          {logoUrl ? (
            <div className="relative group">
              <img src={logoUrl} alt="Front logo" className="w-full aspect-video object-contain bg-black border border-white/10 p-2" />
              <button onClick={() => setLogoUrl(null)} className="absolute top-1 right-1 bg-red text-white text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
          ) : (
            <div className="w-full aspect-video bg-black border border-dashed border-white/15 flex items-center justify-center text-[10px] text-creamDim">None yet</div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-[10px] uppercase text-creamDim mb-1">Back</p>
          {backLogoUrl ? (
            <div className="relative group">
              <img src={backLogoUrl} alt="Back logo" className="w-full aspect-video object-contain bg-black border border-white/10 p-2" />
              <button onClick={() => setBackLogoUrl(null)} className="absolute top-1 right-1 bg-red text-white text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
          ) : (
            <div className="w-full aspect-video bg-black border border-dashed border-white/15 flex items-center justify-center text-[10px] text-creamDim">None yet</div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
          <Link href="/dashboard" className="block text-xs text-creamDim hover:text-gold transition-colors">
            → Saved Designs
          </Link>
          <Link href="/shop" className="block text-xs text-creamDim hover:text-gold transition-colors">
            → Browse Products
          </Link>
        </div>
      </aside>

      {/* CENTER — big preview */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-carbon lg:bg-black">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView("front")}
            className={`px-6 py-2.5 text-xs uppercase tracking-widest border transition-all ${
              view === "front" ? "border-gold text-goldBright bg-gold/10" : "border-white/20 text-creamDim"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setView("back")}
            className={`px-6 py-2.5 text-xs uppercase tracking-widest border transition-all ${
              view === "back" ? "border-gold text-goldBright bg-gold/10" : "border-white/20 text-creamDim"
            }`}
          >
            Back
          </button>
        </div>

        <SuitSVG
          ref={svgRef}
          colors={colors}
          pattern={pattern}
          view={view}
          number={number}
          flag={flag}
          logoUrl={currentLogoUrl}
          logoTransform={currentLogoTransform}
          interactive
          onLogoPointerDown={() => (dragging.current = true)}
          className="mx-auto"
          style={{ width: "100%", maxWidth: 640, aspectRatio: "300 / 440", display: "block" }}
          svgHandlers={{
            onMouseMove: (e) => {
              if (!dragging.current) return;
              const p = svgPoint(e.clientX, e.clientY);
              updateActiveLogoTransform((t) => ({ ...t, x: p.x, y: p.y }));
            },
            onMouseUp: () => (dragging.current = false),
            onTouchMove: (e) => {
              if (!dragging.current || !e.touches[0]) return;
              const p = svgPoint(e.touches[0].clientX, e.touches[0].clientY);
              updateActiveLogoTransform((t) => ({ ...t, x: p.x, y: p.y }));
            },
            onTouchEnd: () => (dragging.current = false),
          }}
        />

        <button
          onClick={() => setShow3D((s) => !s)}
          className="mt-8 text-xs uppercase tracking-widest text-creamDim border border-white/20 px-5 py-2.5 hover:border-gold hover:text-gold transition-colors"
        >
          {show3D ? "Hide" : "Show"} 360° Preview
        </button>

        {show3D && (
          <div className="mt-8 pt-8 border-t border-white/10 w-full max-w-md">
            <SuitPreview3D
              colors={colors}
              pattern={pattern}
              logoUrl={logoUrl}
              logoTransform={logoTransform}
              backLogoUrl={backLogoUrl}
              backLogoTransform={backLogoTransform}
            />
          </div>
        )}
      </div>

      {/* RIGHT — collapsible customization panel */}
      <aside className="border-l border-white/10 p-6 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto">
        <h1 className="font-display font-extrabold uppercase text-2xl mb-1">Build Your Suit.</h1>
        <p className="text-creamDim text-xs mb-1">Customizing: {productName}</p>
        <p className="text-creamDim text-xs mb-6">
          Editing the <span className="text-gold">{view}</span>
        </p>

        <CollapsibleSection title="Templates" defaultOpen>
          <p className="text-creamDim text-xs mb-3">25 ready-made designs — click one, then customize below.</p>
          <div className="grid grid-cols-3 gap-2.5">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => applyTemplate(t)}
                className={`border p-1.5 pb-2 text-center transition-all group ${
                  activeTemplate === t.name ? "border-gold bg-gold/10" : "border-white/15 hover:border-white/40"
                }`}
              >
                <div className="bg-black/40 mb-1.5 group-hover:scale-105 transition-transform">
                  <SuitSVG colors={t.colors} pattern={t.pattern || "chevron"} view="front" className="w-full h-20" />
                </div>
                <span className="text-[8px] uppercase text-creamDim leading-tight block">{t.name}</span>
              </button>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Colors">
          <div className="flex gap-2 flex-wrap mb-4">
            {PANELS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePanel(p.id)}
                className={`px-3 py-1.5 text-xs uppercase border transition-all ${
                  activePanel === p.id ? "border-gold text-goldBright bg-gold/10" : "border-white/20 text-creamDim hover:border-white/40"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <ColorPicker color={colors[activePanel]} onChange={setColor} />

          <p className="text-[10px] uppercase text-creamDim mt-4 mb-2">Quick Presets</p>
          <div className="flex gap-2 flex-wrap">
            {SWATCHES.map((hex) => (
              <button
                key={hex}
                onClick={() => setColor(hex)}
                style={{ background: hex }}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  colors[activePanel] === hex ? "border-white ring-2 ring-gold" : "border-white/15"
                }`}
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={`${view === "front" ? "Front" : "Back"} Logo`}>
          <label className="block border border-dashed border-gold/50 text-center p-5 text-sm text-creamDim cursor-pointer hover:bg-gold/5 transition-colors">
            {currentLogoUrl ? "Logo uploaded — click to replace" : `Click to upload a ${view} logo`}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          <div className="flex items-center gap-3 mt-4">
            <label className="font-mono text-xs text-creamDim w-14">Size</label>
            <input type="range" min={0.5} max={2.5} step={0.1} value={currentLogoTransform.scale}
              onChange={(e) => updateActiveLogoTransform((t) => ({ ...t, scale: Number(e.target.value) }))}
              className="flex-1" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <label className="font-mono text-xs text-creamDim w-14">Rotate</label>
            <input type="range" min={0} max={360} value={currentLogoTransform.rotate}
              onChange={(e) => updateActiveLogoTransform((t) => ({ ...t, rotate: Number(e.target.value) }))}
              className="flex-1" />
          </div>
          <p className="text-xs text-creamDim mt-3">
            Drag the logo directly on the preview to position it.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title="Name, Number & Flag">
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={16}
            className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm mb-3" placeholder="Driver / Player Name" />
          <input value={number} onChange={(e) => setNumber(e.target.value)} maxLength={2}
            className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm mb-3" placeholder="Racing Number" />
          <select value={flag} onChange={(e) => setFlag(e.target.value)}
            className="w-full bg-carbon border border-white/15 px-4 py-3 text-sm">
            <option value="#38383e">No Flag</option>
            <option value="#c8102e">Red</option>
            <option value="#c6a15b">Gold</option>
            <option value="#1c3d7a">Blue</option>
            <option value="#1e7a3d">Green</option>
          </select>
        </CollapsibleSection>

        <div className="flex flex-col gap-3 mt-6 sticky bottom-0 bg-black pt-4 pb-2">
          <button onClick={requestQuote} disabled={quoting}
            className="bg-gold text-black px-6 py-4 text-sm font-bold uppercase tracking-wide hover:bg-goldBright transition-all disabled:opacity-50">
            {quoting ? "Sending..." : "Request Quote"}
          </button>
          <button onClick={saveDesign} className="border border-white/30 px-6 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-white/5 hover:border-white transition-all">
            Save Design
          </button>
          {saved && !quoteSent && (
            <div className="bg-gold/10 border border-gold text-goldBright text-xs px-4 py-3">
              Design saved to the database.
            </div>
          )}
          {quoteSent && (
            <div className="bg-gold/10 border border-gold text-goldBright text-xs px-4 py-3">
              Quote sent — check your <Link href="/dashboard" className="underline">dashboard</Link>.
            </div>
          )}
        </div>
      </aside>
    </main>
  );
}

function CollapsibleSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="mb-4 border border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-carbon hover:bg-carbon2 transition-colors"
      >
        <span className="font-mono text-xs uppercase text-gold tracking-widest">{title}</span>
        <span className={`text-creamDim text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && <div className="p-4 border-t border-white/10">{children}</div>}
    </div>
  );
}

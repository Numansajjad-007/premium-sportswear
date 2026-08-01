import { forwardRef } from "react";

export type SuitColors = Record<string, string>;

const OUTLINE = "M 150.0,8.0 C 152.3,8.3 160.7,7.3 164.0,10.0 C 167.3,12.7 164.0,20.7 170.0,24.0 C 176.0,27.3 191.3,26.0 200.0,30.0 C 208.7,34.0 217.0,34.7 222.0,48.0 C 227.0,61.3 229.7,89.3 230.0,110.0 C 230.3,130.7 225.3,158.0 224.0,172.0 C 222.7,186.0 226.7,190.7 222.0,194.0 C 217.3,197.3 199.7,196.3 196.0,192.0 C 192.3,187.7 198.7,183.3 200.0,168.0 C 201.3,152.7 205.7,118.0 204.0,100.0 C 202.3,82.0 191.3,60.0 190.0,60.0 C 188.7,60.0 196.0,81.7 196.0,100.0 C 196.0,118.3 190.0,152.5 190.0,170.0 C 190.0,187.5 195.7,195.8 196.0,205.0 C 196.3,214.2 193.3,209.2 192.0,225.0 C 190.7,240.8 189.7,273.3 188.0,300.0 C 186.3,326.7 183.3,367.5 182.0,385.0 C 180.7,402.5 184.0,402.0 180.0,405.0 C 176.0,408.0 161.7,406.3 158.0,403.0 C 154.3,399.7 158.7,402.2 158.0,385.0 C 157.3,367.8 155.3,327.8 154.0,300.0 C 152.7,272.2 151.3,218.0 150.0,218.0 C 148.7,218.0 147.3,272.2 146.0,300.0 C 144.7,327.8 142.7,367.8 142.0,385.0 C 141.3,402.2 145.7,399.7 142.0,403.0 C 138.3,406.3 124.0,408.0 120.0,405.0 C 116.0,402.0 119.3,402.5 118.0,385.0 C 116.7,367.5 113.7,326.7 112.0,300.0 C 110.3,273.3 109.3,240.8 108.0,225.0 C 106.7,209.2 103.7,214.2 104.0,205.0 C 104.3,195.8 110.0,187.5 110.0,170.0 C 110.0,152.5 104.0,118.3 104.0,100.0 C 104.0,81.7 111.3,60.0 110.0,60.0 C 108.7,60.0 97.7,82.0 96.0,100.0 C 94.3,118.0 98.7,152.7 100.0,168.0 C 101.3,183.3 107.7,187.7 104.0,192.0 C 100.3,196.3 82.7,197.3 78.0,194.0 C 73.3,190.7 77.3,186.0 76.0,172.0 C 74.7,158.0 69.7,130.7 70.0,110.0 C 70.3,89.3 73.0,61.3 78.0,48.0 C 83.0,34.7 91.3,34.0 100.0,30.0 C 108.7,26.0 124.0,27.3 130.0,24.0 C 136.0,20.7 132.7,12.7 136.0,10.0 C 139.3,7.3 147.7,8.3 150.0,8.0 Z";
const CHEST = "M 150.0,10.0 C 156.7,10.0 163.3,15.7 170.0,24.0 C 176.7,32.3 185.7,47.3 190.0,60.0 C 194.3,72.7 202.7,92.3 196.0,100.0 C 189.3,107.7 165.3,106.0 150.0,106.0 C 134.7,106.0 110.7,107.7 104.0,100.0 C 97.3,92.3 105.7,72.7 110.0,60.0 C 114.3,47.3 123.3,32.3 130.0,24.0 C 136.7,15.7 143.3,10.0 150.0,10.0 Z";
const CHEVRON_R = "M 196,100 C 200,120 199,140 190,170 L 168,178 C 172,150 165,125 155,112 Z";
const CHEVRON_L = "M 104,100 C 100,120 101,140 110,170 L 132,178 C 128,150 135,125 145,112 Z";

// Diagonal stripe pattern (sash + accent + arm stripes)
const DIAG_MAIN = "M 105,28 L 135,28 L 205,205 L 175,205 Z";
const DIAG_ACCENT = "M 140,28 L 155,28 L 208,190 L 193,190 Z";
const DIAG_ARM_R = "M 205,50 L 215,50 L 232,160 L 222,160 Z";
const DIAG_ARM_L = "M 95,50 L 85,50 L 68,160 L 78,160 Z";

// Angular block pattern (jagged chest blocks, like a lightning-bolt livery)
const BLOCK_R = "M 150,30 L 204,52 L 196,100 L 165,112 L 150,80 Z";
const BLOCK_L = "M 150,30 L 96,52 L 104,100 L 135,112 L 150,80 Z";
const BLOCK_ARM_R = "M 202,55 L 228,68 L 218,150 L 200,145 Z";
const BLOCK_ARM_L = "M 98,55 L 72,68 L 82,150 L 100,145 Z";

// Side blade sweep (single swooping panel down one side)
const BLADE_R = "M 205,60 C 215,110 212,160 200,205 C 210,240 205,320 195,385 L 178,378 C 186,320 190,245 182,208 C 192,165 195,110 186,65 Z";
const BLADE_L = "M 95,60 C 85,110 88,160 100,205 C 90,240 95,320 105,385 L 122,378 C 114,320 110,245 118,208 C 108,165 105,110 114,65 Z";
const ARM_R = "M 200.0,30.0 C 205.3,28.0 217.0,34.7 222.0,48.0 C 227.0,61.3 229.7,89.3 230.0,110.0 C 230.3,130.7 225.3,158.0 224.0,172.0 C 222.7,186.0 226.7,190.7 222.0,194.0 C 217.3,197.3 199.7,196.3 196.0,192.0 C 192.3,187.7 198.7,183.3 200.0,168.0 C 201.3,152.7 205.7,118.0 204.0,100.0 C 202.3,82.0 190.7,71.7 190.0,60.0 C 189.3,48.3 194.7,32.0 200.0,30.0 Z";
const ARM_L = "M 100.0,30.0 C 94.7,28.0 83.0,34.7 78.0,48.0 C 73.0,61.3 70.3,89.3 70.0,110.0 C 69.7,130.7 74.7,158.0 76.0,172.0 C 77.3,186.0 73.3,190.7 78.0,194.0 C 82.7,197.3 100.3,196.3 104.0,192.0 C 107.7,187.7 101.3,183.3 100.0,168.0 C 98.7,152.7 94.3,118.0 96.0,100.0 C 97.7,82.0 109.3,71.7 110.0,60.0 C 110.7,48.3 105.3,32.0 100.0,30.0 Z";
const LEG_R = "M 196.0,205.0 C 203.0,206.2 193.3,209.2 192.0,225.0 C 190.7,240.8 189.7,273.3 188.0,300.0 C 186.3,326.7 183.3,367.5 182.0,385.0 C 180.7,402.5 184.0,402.0 180.0,405.0 C 176.0,408.0 161.7,406.3 158.0,403.0 C 154.3,399.7 158.7,402.2 158.0,385.0 C 157.3,367.8 155.3,327.8 154.0,300.0 C 152.7,272.2 143.0,233.8 150.0,218.0 C 157.0,202.2 189.0,203.8 196.0,205.0 Z";
const LEG_L = "M 104.0,205.0 C 97.0,206.2 106.7,209.2 108.0,225.0 C 109.3,240.8 110.3,273.3 112.0,300.0 C 113.7,326.7 116.7,367.5 118.0,385.0 C 119.3,402.5 116.0,402.0 120.0,405.0 C 124.0,408.0 138.3,406.3 142.0,403.0 C 145.7,399.7 141.3,402.2 142.0,385.0 C 142.7,367.8 144.7,327.8 146.0,300.0 C 147.3,272.2 157.0,233.8 150.0,218.0 C 143.0,202.2 111.0,203.8 104.0,205.0 Z";

export type GraphicPattern = "chevron" | "diagonal" | "blocks" | "blade" | "plain";

type LogoTransform = { x: number; y: number; scale: number; rotate: number };

interface SuitSVGProps {
  colors: SuitColors;
  view: "front" | "back";
  pattern?: GraphicPattern;
  number?: string;
  flag?: string;
  logoUrl?: string | null;
  logoTransform?: LogoTransform;
  interactive?: boolean;
  onLogoPointerDown?: () => void;
  className?: string;
  style?: React.CSSProperties;
  svgHandlers?: React.SVGProps<SVGSVGElement>;
}

export const SuitSVG = forwardRef<SVGSVGElement, SuitSVGProps>(function SuitSVG(
  { colors, view, pattern = "chevron", number, flag, logoUrl, logoTransform, interactive, onLogoPointerDown, className, style, svgHandlers },
  ref
) {
  const clipId = `suitClip-${view}`;
  const patternColor = colors.panelStripe;
  const patternColor2 = colors.panelCollar; // secondary accent for two-tone patterns

  function renderFrontPattern() {
    switch (pattern) {
      case "diagonal":
        return (
          <>
            <path d={DIAG_MAIN} fill={patternColor} className="transition-all duration-300" />
            <path d={DIAG_ACCENT} fill={patternColor2} className="transition-all duration-300" />
            <path d={DIAG_ARM_R} fill={patternColor} className="transition-all duration-300" />
            <path d={DIAG_ARM_L} fill={patternColor} className="transition-all duration-300" />
          </>
        );
      case "blocks":
        return (
          <>
            <path d={BLOCK_R} fill={patternColor} className="transition-all duration-300" />
            <path d={BLOCK_L} fill={patternColor} className="transition-all duration-300" />
            <path d={BLOCK_ARM_R} fill={patternColor2} className="transition-all duration-300" />
            <path d={BLOCK_ARM_L} fill={patternColor2} className="transition-all duration-300" />
          </>
        );
      case "blade":
        return (
          <>
            <path d={BLADE_R} fill={patternColor} className="transition-all duration-300" />
            <path d={BLADE_L} fill={patternColor} className="transition-all duration-300" />
          </>
        );
      case "plain":
        return null;
      case "chevron":
      default:
        return (
          <>
            <path d={CHEVRON_R} fill={patternColor} className="transition-all duration-300" />
            <path d={CHEVRON_L} fill={patternColor} className="transition-all duration-300" />
          </>
        );
    }
  }
  return (
    <svg ref={ref} viewBox="0 0 300 440" className={className} style={style} {...svgHandlers}>
      <defs>
        <clipPath id={clipId}>
          <path d={OUTLINE} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <path d={OUTLINE} fill={colors.panelBase} className="transition-all duration-300" />
        <path d={ARM_R} fill={colors.panelArms} className="transition-all duration-300" />
        <path d={ARM_L} fill={colors.panelArms} className="transition-all duration-300" />
        <path d={LEG_R} fill={colors.panelLegs} className="transition-all duration-300" />
        <path d={LEG_L} fill={colors.panelLegs} className="transition-all duration-300" />

        {view === "front" ? (
          <>
            <path d={CHEST} fill={colors.panelChest} className="transition-all duration-300" />
            {renderFrontPattern()}
          </>
        ) : (
          <path d={CHEST} fill={colors.panelChest} className="transition-all duration-300" />
        )}

        <rect x="192" y="32" width="36" height="14" rx="3" fill={colors.panelShoulders} className="transition-all duration-300" />
        <rect x="72" y="32" width="36" height="14" rx="3" fill={colors.panelShoulders} className="transition-all duration-300" />

        <rect x="60" y="170" width="180" height="22" fill={colors.panelCuffs} className="transition-all duration-300" />
        <rect x="60" y="378" width="80" height="30" fill={colors.panelCuffs} className="transition-all duration-300" />
        <rect x="160" y="378" width="80" height="30" fill={colors.panelCuffs} className="transition-all duration-300" />

        <rect x="90" y="196" width="120" height="15" fill={colors.panelBelt} className="transition-all duration-300" />
        <rect x="130" y="6" width="40" height="18" fill={colors.panelCollar} className="transition-all duration-300" />
      </g>

      {view === "front" && (
        <>
          <path d="M 170,24 C 178,40 186,50 190,60" fill="none" stroke="#0a0a0b" strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
          <path d="M 130,24 C 122,40 114,50 110,60" fill="none" stroke="#0a0a0b" strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
        </>
      )}

      <path d={OUTLINE} fill="none" stroke="#0a0a0b" strokeWidth={2} strokeLinejoin="round" />

      {view === "front" && (
        <>
          <text x="150" y="145" textAnchor="middle" fontFamily="'Big Shoulders Display', sans-serif" fontWeight={900} fontSize={34} fill="#f2f1ee">
            {number || "00"}
          </text>
          {flag && <rect x="126" y="30" width="48" height="22" fill={flag} stroke="#0a0a0b" strokeWidth={1} />}
        </>
      )}

      {logoTransform && (
        <g
          transform={`translate(${logoTransform.x},${logoTransform.y}) rotate(${logoTransform.rotate}) scale(${logoTransform.scale})`}
          onMouseDown={interactive ? onLogoPointerDown : undefined}
          onTouchStart={interactive ? onLogoPointerDown : undefined}
          style={{ cursor: interactive ? "grab" : "default" }}
        >
          {logoUrl ? (
            <image href={logoUrl} x={-30} y={-15} width={60} height={30} />
          ) : interactive ? (
            <>
              <rect x={-30} y={-15} width={60} height={30} fill="none" stroke="rgba(198,161,91,0.5)" strokeDasharray="4 3" />
              <text x={0} y={4} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={7} fill="rgba(198,161,91,0.6)">
                DRAG ME
              </text>
            </>
          ) : null}
        </g>
      )}
    </svg>
  );
});

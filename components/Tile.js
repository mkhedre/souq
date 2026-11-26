// Colored gradient tile with the item's initial, deterministic by name.
// Replaces emoji product icons so the UI never depends on emoji fonts.
const PALETTES = [
  ["#10b981", "#065f46"], ["#f59e0b", "#b45309"], ["#3b82f6", "#1d4ed8"],
  ["#ef4444", "#b91c1c"], ["#8b5cf6", "#6d28d9"], ["#06b6d4", "#0e7490"],
  ["#f97316", "#c2410c"], ["#ec4899", "#be185d"], ["#84cc16", "#4d7c0f"],
  ["#14b8a6", "#0f766e"],
];
export const palette = (seed = "") => {
  let h = 0;
  for (const ch of String(seed)) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return PALETTES[h % PALETTES.length];
};
export default function Tile({ name = "", image = "", className = "", style }) {
  if (image) return <div className={`tile ${className}`} style={{ padding: 0, ...style }}><img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>;
  const [a, b] = palette(name);
  const initial = (String(name).trim()[0] || "؟");
  return <div className={`tile ${className}`} style={{ background: `linear-gradient(135deg,${a},${b})`, ...style }}>{initial}</div>;
}
export function Dot({ seed = "" }) {
  const [a] = palette(seed);
  return <span className="dot" style={{ background: a }} />;
}

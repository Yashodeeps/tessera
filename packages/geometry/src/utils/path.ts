import { Vec2, lerp } from "@tessera/math";

export function subdivideLine(a: Vec2, b: Vec2, segments: number): Vec2[] {
  const out: Vec2[] = [];
  if (segments <= 0) {
    return [a];
  }
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    out.push(lerp(a, b, t));
  }
  return out;
}

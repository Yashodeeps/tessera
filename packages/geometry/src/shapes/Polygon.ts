import { Vec2 } from "@tessera/math";

export interface Polygon {
  points: Vec2[];
}

export function makePolygon(points: Vec2[]): Polygon {
  return { points };
}

export function polygonArea(poly: Polygon): number {
  const pts = poly.points;
  if (pts.length < 2) return 0;
  
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]!;
    const b = pts[(i + 1) % pts.length]!;
    sum += a.x * b.y - a.y * b.x;
  }
  return Math.abs(sum) / 2;
}

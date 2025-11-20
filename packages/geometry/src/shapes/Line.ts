import { Vec2 } from "@tessera/math";

export interface Line {
  a: Vec2;
  b: Vec2;
}

export function makeLine(a: Vec2, b: Vec2): Line {
  return { a, b };
}

export function lineLength(l: Line): number {
  return Math.sqrt(
    (l.b.x - l.a.x) ** 2 +
      (l.b.y - l.a.y) ** 2
  );
}

export function linePointAt(l: Line, t: number): Vec2 {
  return {
    x: l.a.x + (l.b.x - l.a.x) * t,
    y: l.a.y + (l.b.y - l.a.y) * t,
  };
}

import { Vec2, distance } from "@tessera/math";

export interface Circle {
  cx: number;
  cy: number;
  r: number;
}

export function makeCircle(cx: number, cy: number, r: number): Circle {
  return { cx, cy, r };
}

export function circleContainsPoint(c: Circle, p: Vec2): boolean {
  return distance(p, { x: c.cx, y: c.cy }) <= c.r;
}

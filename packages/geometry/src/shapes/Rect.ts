import { Vec2 } from "@tessera/math";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function makeRect(x: number, y: number, w: number, h: number): Rect {
  return { x, y, width: w, height: h };
}

export function rectContainsPoint(rect: Rect, p: Vec2): boolean {
  return (
    p.x >= rect.x &&
    p.x <= rect.x + rect.width &&
    p.y >= rect.y &&
    p.y <= rect.y + rect.height
  );
}

export function rectCenter(rect: Rect): Vec2 {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

export function rectToPolygon(r: Rect) {
  const { x, y, width, height } = r;
  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];
}

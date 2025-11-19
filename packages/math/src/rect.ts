import { Rect, Vec2 } from "./types";

export const rect = (x = 0, y = 0, width = 0, height = 0): Rect => ({
  x,
  y,
  width,
  height
});

export const containsPoint = (r: Rect, p: Vec2): boolean =>
  p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height;

export const intersects = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

export const union = (a: Rect, b: Rect): Rect => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const x2 = Math.max(a.x + a.width, b.x + b.width);
  const y2 = Math.max(a.y + a.height, b.y + b.height);
  return rect(x, y, x2 - x, y2 - y);
};

export const fromPoints = (points: Vec2[]): Rect => {
  if (points.length === 0) return rect(0, 0, 0, 0);
  const first = points[0]!;
  let minX = first.x;
  let minY = first.y;
  let maxX = first.x;
  let maxY = first.y;
  for (let i = 1; i < points.length; i++) {
    const p = points[i]!;
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return rect(minX, minY, maxX - minX, maxY - minY);
};

export const center = (r: Rect): Vec2 => ({
  x: r.x + r.width / 2,
  y: r.y + r.height / 2
});

import { Vec2 } from "@tessera/math";
import { Polygon } from "../shapes/Polygon";

export interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function bboxOfPoints(points: Vec2[]): BBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return { minX, minY, maxX, maxY };
}

export function bboxContainsPoint(b: BBox, p: Vec2): boolean {
  return (
    p.x >= b.minX &&
    p.x <= b.maxX &&
    p.y >= b.minY &&
    p.y <= b.maxY
  );
}

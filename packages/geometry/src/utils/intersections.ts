import { Vec2 } from "@tessera/math";
import { Rect, rectContainsPoint } from "../shapes/Rect";
import { Circle } from "../shapes/Circle";

export function lineLineIntersection(
  p1: Vec2,
  p2: Vec2,
  p3: Vec2,
  p4: Vec2
): Vec2 | null {
  const den =
    (p1.x - p2.x) * (p3.y - p4.y) -
    (p1.y - p2.y) * (p3.x - p4.x);

  if (Math.abs(den) < 0.000001) return null;

  const px =
    ((p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) -
      (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x)) /
    den;

  const py =
    ((p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) -
      (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x)) /
    den;

  return { x: px, y: py };
}

export function circleRectIntersect(circle: Circle, rect: Rect): boolean {
  // clamp circle center to rect edges
  const clampedX = Math.max(rect.x, Math.min(circle.cx, rect.x + rect.width));
  const clampedY = Math.max(rect.y, Math.min(circle.cy, rect.y + rect.height));

  const dx = circle.cx - clampedX;
  const dy = circle.cy - clampedY;

  return dx * dx + dy * dy <= circle.r * circle.r;
}

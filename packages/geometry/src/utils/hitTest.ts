import { Vec2 } from "@tessera/math";
import { Rect, rectContainsPoint } from "../shapes/Rect";
import { Circle, circleContainsPoint } from "../shapes/Circle";
import { Polygon } from "../shapes/Polygon";
import { Line } from "../shapes/Line";
import { AnyShape } from "../types";

/**
 * Hit test a point against any shape type
 */
export function hitTestPoint(shape: AnyShape, point: Vec2): boolean {
  if ("x" in shape && "width" in shape) {
    // Rect
    return rectContainsPoint(shape as Rect, point);
  } else if ("cx" in shape && "r" in shape) {
    // Circle
    return circleContainsPoint(shape as Circle, point);
  } else if ("points" in shape) {
    // Polygon
    return polygonContainsPoint(shape as Polygon, point);
  } else if ("a" in shape && "b" in shape) {
    // Line - check if point is close to line segment
    return lineContainsPoint(shape as Line, point, 2); // 2px tolerance
  }
  return false;
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
function polygonContainsPoint(poly: Polygon, point: Vec2): boolean {
  const points = poly.points;
  if (points.length < 3) return false;

  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i]!.x;
    const yi = points[i]!.y;
    const xj = points[j]!.x;
    const yj = points[j]!.y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Check if a point is close to a line segment (within tolerance)
 */
function lineContainsPoint(line: Line, point: Vec2, tolerance: number): boolean {
  const { a, b } = line;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    // Line is a point
    const distSq = (point.x - a.x) ** 2 + (point.y - a.y) ** 2;
    return distSq <= tolerance * tolerance;
  }

  // Project point onto line segment
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;

  const distSq = (point.x - projX) ** 2 + (point.y - projY) ** 2;
  return distSq <= tolerance * tolerance;
}


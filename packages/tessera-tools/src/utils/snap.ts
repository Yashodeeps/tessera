import type { Vec2 } from "@tessera/math";

const SNAP_THRESHOLD = 10;

export function snapToGrid(point: Vec2, gridSize: number = 10): Vec2 {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}

export function snapToPoint(
  point: Vec2,
  snapPoints: Vec2[],
  threshold: number = SNAP_THRESHOLD
): Vec2 {
  for (const snapPoint of snapPoints) {
    const dist = Math.sqrt(
      Math.pow(point.x - snapPoint.x, 2) + Math.pow(point.y - snapPoint.y, 2)
    );
    if (dist < threshold) {
      return snapPoint;
    }
  }
  return point;
}

export function snapToLine(
  point: Vec2,
  lines: Array<{ start: Vec2; end: Vec2 }>,
  threshold: number = SNAP_THRESHOLD
): Vec2 {
  let closestPoint: Vec2 | null = null;
  let minDist = threshold;

  for (const line of lines) {
    const { start, end } = line;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSq = dx * dx + dy * dy;

    if (lengthSq === 0) continue;

    const t = Math.max(
      0,
      Math.min(
        1,
        ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq
      )
    );

    const projX = start.x + t * dx;
    const projY = start.y + t * dy;

    const dist = Math.sqrt(
      Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2)
    );

    if (dist < minDist) {
      minDist = dist;
      closestPoint = { x: projX, y: projY };
    }
  }

  return closestPoint || point;
}


import type { Vec2 } from "@tessera/math";

/**
 * Viewport helpers: convert between world (scene) and screen (canvas) coordinates.
 *
 * viewport: { x, y, zoom } from tessera-core store (world origin where screen center maps).
 *
 * We adopt convention:
 *  - viewport.x, viewport.y : world coord of top-left corner of visible area (or camera offset)
 *  - zoom: scale (1 = 100%)
 *
 * The renderer expects (canvasWidth, canvasHeight) to compute transforms.
 */

export type Viewport = { x: number; y: number; zoom: number };

export function worldToScreen(vp: Viewport, canvasW: number, canvasH: number, p: Vec2): Vec2 {
  // world -> screen: (p - vp.x, p - vp.y) * zoom
  return {
    x: (p.x - vp.x) * vp.zoom,
    y: (p.y - vp.y) * vp.zoom
  };
}

export function screenToWorld(vp: Viewport, canvasW: number, canvasH: number, p: Vec2): Vec2 {
  return {
    x: p.x / vp.zoom + vp.x,
    y: p.y / vp.zoom + vp.y
  };
}

/** compute world-space bounding rect for full canvas */
export function screenRectToWorldRect(vp: Viewport, canvasW: number, canvasH: number) {
  const topLeft = screenToWorld(vp, canvasW, canvasH, { x: 0, y: 0 });
  const bottomRight = screenToWorld(vp, canvasW, canvasH, { x: canvasW, y: canvasH });
  return {
    x: topLeft.x,
    y: topLeft.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y
  };
}

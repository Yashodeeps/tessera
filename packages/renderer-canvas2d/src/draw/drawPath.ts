import type { PathShape } from "../types";
import { worldToScreen } from "../utils/viewport";

/** For Phase 4 we treat path as sequence of straight segments */
export function drawPath(
  ctx: CanvasRenderingContext2D,
  vp: { x: number; y: number; zoom: number },
  canvasW: number,
  canvasH: number,
  shape: PathShape,
  style?: { fill?: string; stroke?: string; strokeWidth?: number }
) {
  if (!shape.points || shape.points.length === 0) return;
  ctx.save();
  ctx.beginPath();
  const p0 = shape.points[0];
  if (!p0) return;
  const screenP0 = worldToScreen(vp, canvasW, canvasH, p0);
  ctx.moveTo(screenP0.x, screenP0.y);
  for (let i = 1; i < shape.points.length; i++) {
    const p = shape.points[i];
    if (!p) continue;
    const screenP = worldToScreen(vp, canvasW, canvasH, p);
    ctx.lineTo(screenP.x, screenP.y);
  }
  if (style?.fill) {
    ctx.fillStyle = style.fill;
    ctx.fill();
  }
  if (style?.stroke) {
    ctx.lineWidth = (style.strokeWidth ?? 1) * vp.zoom;
    ctx.strokeStyle = style.stroke;
    ctx.stroke();
  }
  ctx.restore();
}

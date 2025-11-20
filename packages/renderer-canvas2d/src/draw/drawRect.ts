import type { RectShape } from "../types";
import { worldToScreen } from "../utils/viewport";

/** draws a rect shape (world-space) */
export function drawRect(
  ctx: CanvasRenderingContext2D,
  vp: { x: number; y: number; zoom: number },
  canvasW: number,
  canvasH: number,
  shape: RectShape,
  style?: { fill?: string; stroke?: string; strokeWidth?: number }
) {
  const pos = worldToScreen(vp, canvasW, canvasH, shape.position);
  const w = shape.width * (shape.scale?.x ?? 1) * vp.zoom;
  const h = shape.height * (shape.scale?.y ?? 1) * vp.zoom;
  ctx.save();
  // rotation about center
  const cx = pos.x + w / 2;
  const cy = pos.y + h / 2;
  if (shape.rotation) {
    ctx.translate(cx, cy);
    ctx.rotate(shape.rotation);
    ctx.translate(-cx, -cy);
  }
  if (style?.fill) {
    ctx.fillStyle = style.fill;
    ctx.fillRect(pos.x, pos.y, w, h);
  }
  if (style?.stroke) {
    ctx.lineWidth = (style.strokeWidth ?? 1) * vp.zoom;
    ctx.strokeStyle = style.stroke;
    ctx.strokeRect(pos.x, pos.y, w, h);
  }
  ctx.restore();
}

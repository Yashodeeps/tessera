import type { EllipseShape } from "../types";
import { worldToScreen } from "../utils/viewport";

export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  vp: { x: number; y: number; zoom: number },
  canvasW: number,
  canvasH: number,
  shape: EllipseShape,
  style?: { fill?: string; stroke?: string; strokeWidth?: number }
) {
  const pos = worldToScreen(vp, canvasW, canvasH, shape.position);
  const rx = shape.rx * (shape.scale?.x ?? 1) * vp.zoom;
  const ry = shape.ry * (shape.scale?.y ?? 1) * vp.zoom;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(pos.x, pos.y, rx, ry, shape.rotation ?? 0, 0, Math.PI * 2);
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

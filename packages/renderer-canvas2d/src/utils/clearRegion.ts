
/** clear full canvas or region (region in screen coords) */
export function clearCanvas(ctx: CanvasRenderingContext2D, w: number, h: number, region?: { x: number; y: number; w: number; h: number }) {
  if (!region) {
    ctx.clearRect(0, 0, w, h);
    return;
  }
  ctx.clearRect(region.x, region.y, region.w, region.h);
}

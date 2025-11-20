import type { Scene } from "@tessera/core";
import type { Renderer } from "@tessera/core";
import { clearCanvas } from "../utils/clearRegion";
import { drawRect } from "./drawRect";
import { drawEllipse } from "./drawEllipse";
import { drawPolygon } from "./drawPolygon";
import { drawPath } from "./drawPath";
import { screenRectToWorldRect } from "../utils/viewport";
import type { Viewport } from "../utils/viewport";

/**
 * Canvas2DRenderer: Simple, efficient renderer that:
 *  - attaches to an HTMLCanvasElement
 *  - supports viewport transforms (pan/zoom)
 *  - supports dirty-mark optimization (nodeIds changed)
 *  - draws basic shapes using tessera-geometry shape payloads
 *
 * For Phase 4 we keep it simple and correct; later we add batching and partial repaint.
 */

export class Canvas2DRenderer implements Renderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private vp: Viewport = { x: 0, y: 0, zoom: 1 };
  private canvasW = 0;
  private canvasH = 0;
  private devicePixelRatio = 1;
  private pendingDirtyNodes = new Set<string>();

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas2D context unavailable");
    this.ctx = ctx;
    this.devicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    this.resize(canvas.clientWidth, canvas.clientHeight);
  }

  resize(w: number, h: number) {
    if (!this.canvas || !this.ctx) return;
    this.canvasW = Math.round(w);
    this.canvasH = Math.round(h);
    const dpr = this.devicePixelRatio;
    this.canvas.width = Math.round(this.canvasW * dpr);
    this.canvas.height = Math.round(this.canvasH * dpr);
    this.canvas.style.width = `${this.canvasW}px`;
    this.canvas.style.height = `${this.canvasH}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // CSS pixels
  }

  setViewport(vp: Viewport) {
    this.vp = vp;
  }

  markDirty(nodeId: string) {
    this.pendingDirtyNodes.add(nodeId);
  }

  /** simple render: if any dirty nodes exist, clear full canvas and redraw.
   *  Later we can use bounding boxes to repaint partial regions.
   */
  render(scene: Scene) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;

    // conservative: full repaint when pending dirty nodes exist
    if (this.pendingDirtyNodes.size > 0) {
      clearCanvas(ctx, this.canvasW, this.canvasH);
      this.drawScene(ctx, scene);
      this.pendingDirtyNodes.clear();
    } else {
      // no pending changes -> no redraw
    }
  }

  private drawScene(ctx: CanvasRenderingContext2D, scene: Scene): void {
    // basic culling: compute world rect visible
    const worldRect = screenRectToWorldRect(this.vp, this.canvasW, this.canvasH);

    // iterate layers in order
    for (const layerId of scene.rootLayers) {
      const layer = scene.nodes[layerId];
      if (!layer) continue;
      // draw layer children in order
      for (const childId of layer.children) {
        const node = scene.nodes[childId];
        if (!node) continue;
        if (node.type !== "shape") continue;
        const shape = (node as any).shape;
        if (!shape) continue;
        // TODO: use geometry bbox to test intersection with worldRect (broad-phase)
        this.drawShape(ctx, shape);
      }
    }
  }

  private drawShape(ctx: CanvasRenderingContext2D, shape: any): void {
    // style defaults (for demo)
    const style = { fill: "#ffffff", stroke: "#111827", strokeWidth: 1 };
    switch (shape.type) {
      case "rect":
        drawRect(ctx, this.vp, this.canvasW, this.canvasH, shape, style);
        break;
      case "circle":
        // circle shapes drawn as ellipse with rx = ry = radius
        drawEllipse(ctx, this.vp, this.canvasW, this.canvasH, { ...shape, rx: shape.radius, ry: shape.radius }, style);
        break;
      case "ellipse":
        drawEllipse(ctx, this.vp, this.canvasW, this.canvasH, shape, style);
        break;
      case "polygon":
        drawPolygon(ctx, this.vp, this.canvasW, this.canvasH, shape, style);
        break;
      case "polyline":
        drawPath(ctx, this.vp, this.canvasW, this.canvasH, shape as any, { stroke: style.stroke, strokeWidth: 1 });
        break;
      case "path":
        drawPath(ctx, this.vp, this.canvasW, this.canvasH, shape as any, style);
        break;
      default:
        // unknown shape: noop
        break;
    }
  }
}

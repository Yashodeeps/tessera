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
  private currentScene: Scene | null = null;
  private selection: string[] = [];
  private activeTool: string | null = null;
  private previewRect: { x: number; y: number; width: number; height: number } | null = null;
  private marquee: { x: number; y: number; width: number; height: number } | null = null;
  private animationFrameId: number | null = null;
  private needsRedraw = false;

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
    this.requestRedraw();
  }

  setViewport(vp: Viewport) {
    const changed = this.vp.x !== vp.x || this.vp.y !== vp.y || this.vp.zoom !== vp.zoom;
    this.vp = vp;
    if (changed) {
      this.requestRedraw();
    }
  }

  setSelection(selection: string[]) {
    const changed = JSON.stringify(this.selection) !== JSON.stringify(selection);
    this.selection = selection;
    if (changed) {
      this.requestRedraw();
    }
  }

  setActiveTool(tool: string | null) {
    const changed = this.activeTool !== tool;
    this.activeTool = tool;
    if (changed) {
      this.requestRedraw();
    }
  }

  setPreviewRect(rect: { x: number; y: number; width: number; height: number } | null) {
    const changed = JSON.stringify(this.previewRect) !== JSON.stringify(rect);
    this.previewRect = rect;
    if (changed) {
      this.requestRedraw();
    }
  }

  setMarquee(rect: { x: number; y: number; width: number; height: number } | null) {
    const changed = JSON.stringify(this.marquee) !== JSON.stringify(rect);
    this.marquee = rect;
    if (changed) {
      this.requestRedraw();
    }
  }

  markDirty(nodeId: string) {
    this.pendingDirtyNodes.add(nodeId);
    this.requestRedraw();
  }

  private requestRedraw() {
    if (this.needsRedraw) return; // Already scheduled
    this.needsRedraw = true;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.animationFrameId = null;
      this.needsRedraw = false;
      if (this.currentScene) {
        this.render(this.currentScene);
      }
    });
  }

  /** Render the scene. Always redraws if called directly.
   *  For automatic redraws, use requestRedraw() which batches via requestAnimationFrame.
   */
  render(scene: Scene) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;

    this.currentScene = scene;

    // Always redraw when render() is called directly
    clearCanvas(ctx, this.canvasW, this.canvasH);
    this.drawScene(ctx, scene);
    this.drawPreview(ctx);
    this.drawMarquee(ctx);
    this.drawSelection(ctx, scene);
    this.drawResizeHandles(ctx, scene);
    this.pendingDirtyNodes.clear();
  }

  private drawPreview(ctx: CanvasRenderingContext2D): void {
    if (!this.previewRect || this.previewRect.width < 1 || this.previewRect.height < 1) return;

    ctx.save();
    ctx.strokeStyle = "#0066cc";
    ctx.fillStyle = "rgba(0, 102, 204, 0.1)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    // Transform preview rect to screen coords
    const screenPos = {
      x: (this.previewRect.x - this.vp.x) * this.vp.zoom,
      y: (this.previewRect.y - this.vp.y) * this.vp.zoom,
    };
    const screenW = this.previewRect.width * this.vp.zoom;
    const screenH = this.previewRect.height * this.vp.zoom;

    ctx.fillRect(screenPos.x, screenPos.y, screenW, screenH);
    ctx.strokeRect(screenPos.x, screenPos.y, screenW, screenH);

    ctx.restore();
  }

  private drawMarquee(ctx: CanvasRenderingContext2D): void {
    if (!this.marquee || this.marquee.width < 1 || this.marquee.height < 1) return;

    ctx.save();
    ctx.strokeStyle = "#0066cc";
    ctx.fillStyle = "rgba(0, 102, 204, 0.1)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Transform marquee rect to screen coords
    const screenPos = {
      x: (this.marquee.x - this.vp.x) * this.vp.zoom,
      y: (this.marquee.y - this.vp.y) * this.vp.zoom,
    };
    const screenW = this.marquee.width * this.vp.zoom;
    const screenH = this.marquee.height * this.vp.zoom;

    ctx.fillRect(screenPos.x, screenPos.y, screenW, screenH);
    ctx.strokeRect(screenPos.x, screenPos.y, screenW, screenH);

    ctx.restore();
  }

  private drawSelection(ctx: CanvasRenderingContext2D, scene: Scene): void {
    if (this.selection.length === 0) return;

    ctx.save();
    ctx.strokeStyle = "#0066cc";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    for (const nodeId of this.selection) {
      const node = scene.nodes[nodeId];
      if (!node || node.type !== "shape") continue;

      const shape = (node as any).shape;
      if (!shape) continue;

      // Draw selection outline
      if (shape.type === "rect" && shape.width && shape.height) {
        const pos = shape.position || { x: 0, y: 0 };
        const w = shape.width;
        const h = shape.height || shape.width;

        // Transform to screen coords
        const screenPos = {
          x: (pos.x - this.vp.x) * this.vp.zoom,
          y: (pos.y - this.vp.y) * this.vp.zoom,
        };
        const screenW = w * this.vp.zoom;
        const screenH = h * this.vp.zoom;

        ctx.strokeRect(screenPos.x, screenPos.y, screenW, screenH);
      }
    }

    ctx.restore();
  }

  private drawResizeHandles(ctx: CanvasRenderingContext2D, scene: Scene): void {
    // Only draw handles when resize tool is active and there's a selection
    if (this.activeTool !== "resize" || this.selection.length === 0) return;

    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0066cc";
    ctx.lineWidth = 2;

    // Handle size in screen pixels (stays constant regardless of zoom)
    const handleSize = 8;
    const handleRadius = handleSize / 2;

    for (const nodeId of this.selection) {
      const node = scene.nodes[nodeId];
      if (!node || node.type !== "shape") continue;

      const shape = (node as any).shape;
      if (!shape || typeof shape.width !== "number") continue;

      const pos = shape.position || { x: 0, y: 0 };
      const w = shape.width;
      const h = shape.height || shape.width;

      // Calculate handle positions in world coords
      const handles = [
        { x: pos.x, y: pos.y }, // nw
        { x: pos.x + w, y: pos.y }, // ne
        { x: pos.x, y: pos.y + h }, // sw
        { x: pos.x + w, y: pos.y + h }, // se
        { x: pos.x + w / 2, y: pos.y }, // n
        { x: pos.x + w / 2, y: pos.y + h }, // s
        { x: pos.x + w, y: pos.y + h / 2 }, // e
        { x: pos.x, y: pos.y + h / 2 }, // w
      ];

      // Draw each handle
      for (const handle of handles) {
        const screenPos = {
          x: (handle.x - this.vp.x) * this.vp.zoom,
          y: (handle.y - this.vp.y) * this.vp.zoom,
        };

        // Draw handle as a square
        ctx.fillRect(
          screenPos.x - handleRadius,
          screenPos.y - handleRadius,
          handleSize,
          handleSize
        );
        ctx.strokeRect(
          screenPos.x - handleRadius,
          screenPos.y - handleRadius,
          handleSize,
          handleSize
        );
      }
    }

    ctx.restore();
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

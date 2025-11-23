import Tool, { PointerEvent } from "./Tool";
import type { Store } from "@tessera/core";
import { CreateShapeCommand } from "../commands/CreateShapeCommand";
import { History } from "@tessera/core";

export class RectTool implements Tool {
  id = "rect";
  store: Store;
  history: History;
  private dragging = false;
  private start: { x: number; y: number } | null = null;

  constructor(store: Store, history: History) {
    this.store = store;
    this.history = history;
  }

  onPointerDown(e: PointerEvent) {
    this.dragging = true;
    this.start = { x: e.point.x, y: e.point.y };

    const state = this.store.getState();
    this.store.update((s) => ({
      ...s,
      meta: {
        ...(s as any).meta,
        previewRect: { x: e.point.x, y: e.point.y, width: 0, height: 0 },
      },
    } as any));
  }

  onPointerMove(e: PointerEvent) {
    if (!this.dragging || !this.start) return;

    const sx = Math.min(this.start.x, e.point.x);
    const sy = Math.min(this.start.y, e.point.y);
    const ex = Math.max(this.start.x, e.point.x);
    const ey = Math.max(this.start.y, e.point.y);

    const state = this.store.getState();
    this.store.update((s) => ({
      ...s,
      meta: {
        ...(s as any).meta,
        previewRect: { x: sx, y: sy, width: ex - sx, height: ey - sy },
      },
    } as any));
  }

  onPointerUp(e: PointerEvent) {
    if (!this.dragging || !this.start) return;

    const sx = Math.min(this.start.x, e.point.x);
    const sy = Math.min(this.start.y, e.point.y);
    const ex = Math.max(this.start.x, e.point.x);
    const ey = Math.max(this.start.y, e.point.y);

    const w = ex - sx;
    const h = ey - sy;

    if (w < 1 || h < 1) {
      this.dragging = false;
      this.start = null;
      const state = this.store.getState();
      this.store.update((s) => ({
        ...s,
        meta: { ...(s as any).meta, previewRect: null },
      } as any));
      return;
    }

    const id = `shape_${Date.now()}`;
    const scene = this.store.getState().scene;
    const layerId = scene.rootLayers[0];

    if (!layerId) {
      this.dragging = false;
      this.start = null;
      return;
    }

    const nodeObj = {
      id,
      type: "shape" as const,
      parent: layerId,
      children: [],
      transform: {
        position: { x: sx, y: sy },
        rotation: 0,
        scale: { x: 1, y: 1 },
      },
      shape: {
        id,
        type: "rect",
        position: { x: sx, y: sy },
        width: w,
        height: h,
        rotation: 0,
        scale: { x: 1, y: 1 },
      },
    };

    const sceneRef = { scene: this.store.getState().scene };
    const cmd = new CreateShapeCommand(sceneRef, layerId, id, nodeObj);
    this.history.execute(cmd);

    const state = this.store.getState();
    this.store.update((s) => ({
      ...s,
      meta: { ...(s as any).meta, previewRect: null },
    } as any));

    this.dragging = false;
    this.start = null;
  }
}


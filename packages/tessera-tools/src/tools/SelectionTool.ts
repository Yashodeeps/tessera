import Tool, { PointerEvent } from "./Tool";
import type { Store } from "@tessera/core";
import { bboxOfPoints, bboxIntersects, bboxToRect, type BBox } from "@tessera/geometry";
import type { Vec2 } from "@tessera/math";

export class SelectionTool implements Tool {
  id = "select";
  store: Store;
  private dragging = false;
  private dragStart: { x: number; y: number } | null = null;
  private dragRect: { x: number; y: number; width: number; height: number } | null = null;

  constructor(store: Store) {
    this.store = store;
  }

  onPointerDown(e: PointerEvent) {
    this.dragging = true;
    this.dragStart = e.point;
    this.dragRect = null;
  }

  onPointerMove(e: PointerEvent) {
    if (!this.dragging || !this.dragStart) return;

    const sx = Math.min(this.dragStart.x, e.point.x);
    const sy = Math.min(this.dragStart.y, e.point.y);
    const ex = Math.max(this.dragStart.x, e.point.x);
    const ey = Math.max(this.dragStart.y, e.point.y);

    this.dragRect = { x: sx, y: sy, width: ex - sx, height: ey - sy };

    const state = this.store.getState();
    this.store.update((s) => ({
      ...s,
      meta: { ...(s as any).meta, marquee: this.dragRect },
    } as any));
  }

  onPointerUp(e: PointerEvent) {
    if (!this.dragging) return;

    this.dragging = false;

    if (!this.dragRect) {
      this.dragStart = null;
      return;
    }

    const scene = this.store.getState().scene;
    const selected: string[] = [];

    // Convert marquee rect to BBox
    const marqueeBBox: BBox = {
      minX: this.dragRect.x,
      minY: this.dragRect.y,
      maxX: this.dragRect.x + this.dragRect.width,
      maxY: this.dragRect.y + this.dragRect.height,
    };

    for (const id of Object.keys(scene.nodes)) {
      const node = scene.nodes[id];
      if (!node || node.type !== "shape") continue;

      const shape = (node as any).shape;
      if (!shape) continue;

      // Compute shape bbox using geometry ops
      let shapeBBox: BBox | null = null;

      if (shape.type === "rect" && shape.width && shape.height) {
        const points: Vec2[] = [
          { x: shape.position?.x ?? 0, y: shape.position?.y ?? 0 },
          { x: (shape.position?.x ?? 0) + shape.width, y: shape.position?.y ?? 0 },
          { x: (shape.position?.x ?? 0) + shape.width, y: (shape.position?.y ?? 0) + shape.height },
          { x: shape.position?.x ?? 0, y: (shape.position?.y ?? 0) + shape.height },
        ];
        shapeBBox = bboxOfPoints(points);
      } else if (shape.points && Array.isArray(shape.points)) {
        shapeBBox = bboxOfPoints(shape.points);
      }

      if (shapeBBox && bboxIntersects(marqueeBBox, shapeBBox)) {
        selected.push(id);
      }
    }

    this.store.setSelection(selected);

    const state = this.store.getState();
    this.store.update((s) => ({
      ...s,
      meta: { ...(s as any).meta, marquee: null },
    } as any));

    this.dragRect = null;
    this.dragStart = null;
  }
}


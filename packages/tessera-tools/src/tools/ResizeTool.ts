import Tool, { PointerEvent } from "./Tool";
import type { Store } from "@tessera/core";
import { ResizeCommand } from "../commands/ResizeCommand";
import { History } from "@tessera/core";
import type { Vec2 } from "@tessera/math";

type HandleType = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null;

export class ResizeTool implements Tool {
  id = "resize";
  store: Store;
  history: History;
  private dragging = false;
  private targetId: string | null = null;
  private startSize: { width: number; height: number } | null = null;
  private startPosition: { x: number; y: number } | null = null;
  private startPointer: { x: number; y: number } | null = null;
  private handle: HandleType = null;
  private readonly handleSize = 8;

  constructor(store: Store, history: History) {
    this.store = store;
    this.history = history;
  }

  private getHandleAtPoint(shape: any, point: Vec2): HandleType {
    if (!shape || typeof shape.width !== "number") return null;

    const pos = shape.position || { x: 0, y: 0 };
    const w = shape.width;
    const h = shape.height || shape.width;

    // Get viewport to adjust handle size for zoom
    const viewport = this.store.getState().viewport;
    // Handle size in world coordinates should be larger when zoomed out
    const effectiveHandleSize = this.handleSize / viewport.zoom;

    const handles: Array<{ type: HandleType; x: number; y: number }> = [
      { type: "nw", x: pos.x, y: pos.y },
      { type: "ne", x: pos.x + w, y: pos.y },
      { type: "sw", x: pos.x, y: pos.y + h },
      { type: "se", x: pos.x + w, y: pos.y + h },
      { type: "n", x: pos.x + w / 2, y: pos.y },
      { type: "s", x: pos.x + w / 2, y: pos.y + h },
      { type: "e", x: pos.x + w, y: pos.y + h / 2 },
      { type: "w", x: pos.x, y: pos.y + h / 2 },
    ];

    for (const handle of handles) {
      const dist = Math.sqrt(
        Math.pow(point.x - handle.x, 2) + Math.pow(point.y - handle.y, 2)
      );
      if (dist <= effectiveHandleSize) {
        return handle.type;
      }
    }

    return null;
  }

  onPointerDown(e: PointerEvent) {
    const s = this.store.getState();
    if (s.selection.length === 0) return;

    const firstId = s.selection[0];
    if (!firstId) return;
    
    this.targetId = firstId;
    const node = s.scene.nodes[this.targetId];
    if (!node || node.type !== "shape") return;

    const shape = (node as any).shape;
    if (!shape || typeof shape.width !== "number") return;

    this.handle = this.getHandleAtPoint(shape, e.point);
    if (!this.handle) return;

    this.startSize = { width: shape.width, height: shape.height || shape.width };
    this.startPosition = { x: shape.position?.x ?? 0, y: shape.position?.y ?? 0 };
    this.startPointer = e.point;
    this.dragging = true;
  }

  onPointerMove(e: PointerEvent) {
    if (!this.dragging || !this.targetId || !this.startSize || !this.startPosition || !this.startPointer || !this.handle) return;

    const dx = e.point.x - this.startPointer.x;
    const dy = e.point.y - this.startPointer.y;

    const node = this.store.getState().scene.nodes[this.targetId];
    if (!node) return;

    const shape = (node as any).shape;
    let newWidth = this.startSize.width;
    let newHeight = this.startSize.height;
    let newX = this.startPosition.x;
    let newY = this.startPosition.y;

    // Handle-specific resizing
    switch (this.handle) {
      case "se":
        newWidth = Math.max(1, this.startSize.width + dx);
        newHeight = Math.max(1, this.startSize.height + dy);
        break;
      case "sw":
        newWidth = Math.max(1, this.startSize.width - dx);
        newHeight = Math.max(1, this.startSize.height + dy);
        newX = this.startPosition.x + dx;
        break;
      case "ne":
        newWidth = Math.max(1, this.startSize.width + dx);
        newHeight = Math.max(1, this.startSize.height - dy);
        newY = this.startPosition.y + dy;
        break;
      case "nw":
        newWidth = Math.max(1, this.startSize.width - dx);
        newHeight = Math.max(1, this.startSize.height - dy);
        newX = this.startPosition.x + dx;
        newY = this.startPosition.y + dy;
        break;
      case "e":
        newWidth = Math.max(1, this.startSize.width + dx);
        break;
      case "w":
        newWidth = Math.max(1, this.startSize.width - dx);
        newX = this.startPosition.x + dx;
        break;
      case "s":
        newHeight = Math.max(1, this.startSize.height + dy);
        break;
      case "n":
        newHeight = Math.max(1, this.startSize.height - dy);
        newY = this.startPosition.y + dy;
        break;
    }

    shape.width = newWidth;
    shape.height = newHeight;
    if (shape.position) {
      shape.position.x = newX;
      shape.position.y = newY;
    }

    this.store.replaceScene(this.store.getState().scene);
  }

  onPointerUp(e: PointerEvent) {
    if (!this.dragging || !this.targetId || !this.startSize) {
      this.dragging = false;
      this.targetId = null;
      this.startSize = null;
      this.startPosition = null;
      this.startPointer = null;
      this.handle = null;
      return;
    }

    const node = this.store.getState().scene.nodes[this.targetId];
    if (!node) return;

    const shape = (node as any).shape;
    const prev = this.startSize;
    const next = { width: shape.width, height: shape.height };

    const cmd = new ResizeCommand(shape, prev, next);
    this.history.execute(cmd);

    this.dragging = false;
    this.targetId = null;
    this.startSize = null;
    this.startPosition = null;
    this.startPointer = null;
    this.handle = null;
  }
}


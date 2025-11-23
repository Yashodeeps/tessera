import Tool, { PointerEvent } from "./Tool";
import type { Store } from "@tessera/core";
import { History } from "@tessera/core";
import { RotateCommand } from "../commands/RotateCommand";


export class RotateTool implements Tool {
  id = "rotate";
  store: Store;
  history: History;
  private dragging = false;
  private targetId: string | null = null;
  private startRot = 0;
  private center = { x: 0, y: 0 };

  constructor(store: Store, history: History) {
    this.store = store;
    this.history = history;
  }

  onPointerDown(e: PointerEvent) {
    const s = this.store.getState();
    if (s.selection.length === 0) return;

    const firstId = s.selection[0];
    if (!firstId) return;
    
    this.targetId = firstId;
    const node = s.scene.nodes[this.targetId];
    if (!node || !node.transform) return;

    const shape = (node as any).shape;
    this.center = {
      x: (shape.position?.x ?? 0) + (shape.width || 0) / 2,
      y: (shape.position?.y ?? 0) + (shape.height || 0) / 2,
    };

    this.startRot = node.transform.rotation ?? 0;
    this.dragging = true;
  }

  onPointerMove(e: PointerEvent) {
    if (!this.dragging || !this.targetId) return;

    const node = this.store.getState().scene.nodes[this.targetId];
    if (!node || !node.transform) return;

    const angle = Math.atan2(e.point.y - this.center.y, e.point.x - this.center.x);

    node.transform = {
      ...node.transform,
      rotation: angle,
    };

    this.store.replaceScene(this.store.getState().scene);
  }

  onPointerUp(e: PointerEvent) {
    if (!this.dragging || !this.targetId) {
      this.dragging = false;
      this.targetId = null;
      return;
    }

    const node = this.store.getState().scene.nodes[this.targetId];
    if (!node || !node.transform) return;

    const prev = this.startRot;
    const next = node.transform.rotation ?? 0;

    const sceneRef = { scene: this.store.getState().scene };
    const cmd = new RotateCommand(sceneRef, this.targetId, prev, next);
    this.history.execute(cmd);

    this.dragging = false;
    this.targetId = null;
  }
}


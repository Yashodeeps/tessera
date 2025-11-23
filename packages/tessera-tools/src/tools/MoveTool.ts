import Tool, { PointerEvent } from "./Tool";
import type { Store } from "@tessera/core";
import { History } from "@tessera/core";
import { MoveCommand } from "../commands/MoveCommand";
import { snapToGrid, snapToPoint } from "../utils/snap";
import type { Vec2 } from "@tessera/math";


export class MoveTool implements Tool {
  id = "move";
  store: Store;
  history: History;
  private dragging = false;
  private targetIds: string[] = [];
  private startPositions: Map<string, { x: number; y: number }> = new Map();
  private startPointer: { x: number; y: number } | null = null;

  constructor(store: Store, history: History) {
    this.store = store;
    this.history = history;
  }

  onPointerDown(e: PointerEvent) {
    const state = this.store.getState();
    const selection = state.selection;

    if (selection.length === 0) return;

    // Multi-select move: store all selected nodes
    this.targetIds = selection.filter((id): id is string => id !== null && id !== undefined);
    this.startPositions.clear();

    for (const id of this.targetIds) {
      const node = state.scene.nodes[id];
      if (!node) continue;

      // Get position from transform or shape
      let pos = { x: 0, y: 0 };
      if (node.transform) {
        pos = { x: node.transform.position.x, y: node.transform.position.y };
      } else if (node.type === "shape") {
        const shape = (node as any).shape;
        if (shape && shape.position) {
          pos = { x: shape.position.x, y: shape.position.y };
        }
      }

      this.startPositions.set(id, pos);
    }

    if (this.targetIds.length === 0) return;

    this.dragging = true;
    this.startPointer = { x: e.point.x, y: e.point.y };
  }

  onPointerMove(e: PointerEvent) {
    if (!this.dragging || this.targetIds.length === 0 || !this.startPointer) return;

    let dx = e.point.x - this.startPointer.x;
    let dy = e.point.y - this.startPointer.y;

    // Apply snapping
    const snappedPoint: Vec2 = snapToGrid({ x: e.point.x, y: e.point.y }, 10);
    dx = snappedPoint.x - this.startPointer.x;
    dy = snappedPoint.y - this.startPointer.y;

    // Move all selected nodes
    for (const id of this.targetIds) {
      const startPos = this.startPositions.get(id);
      if (!startPos) continue;

      const node = this.store.getState().scene.nodes[id];
      if (!node) continue;

      const newX = startPos.x + dx;
      const newY = startPos.y + dy;

      // Update transform.position if it exists
      if (node.transform) {
        node.transform = {
          ...node.transform,
          position: {
            x: newX,
            y: newY,
          },
        };
      }

      // Also update shape.position (renderer uses this)
      if (node.type === "shape") {
        const shape = (node as any).shape;
        if (shape && shape.position) {
          shape.position.x = newX;
          shape.position.y = newY;
        }
      }
    }

    this.store.replaceScene(this.store.getState().scene);
  }

  onPointerUp(e: PointerEvent) {
    if (!this.dragging || this.targetIds.length === 0) {
      this.dragging = false;
      this.targetIds = [];
      this.startPositions.clear();
      this.startPointer = null;
      return;
    }

    // Create commands for all moved nodes
    const sceneRef = { scene: this.store.getState().scene };
    for (const id of this.targetIds) {
      const startPos = this.startPositions.get(id);
      if (!startPos) continue;

      const node = sceneRef.scene.nodes[id];
      if (!node || !node.transform) continue;

      const next = {
        x: node.transform.position.x,
        y: node.transform.position.y,
      };

      const cmd = new MoveCommand(sceneRef, id, startPos, next);
      this.history.execute(cmd);
    }

    this.dragging = false;
    this.targetIds = [];
    this.startPositions.clear();
    this.startPointer = null;
  }
}


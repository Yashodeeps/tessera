import Command from "./Command";
import type { Scene } from "@tessera/core";


export class MoveCommand implements Command {
  private sceneRef: { scene: Scene };
  private nodeId: string;
  private prevPos: { x: number; y: number };
  private nextPos: { x: number; y: number };

  constructor(
    sceneRef: { scene: Scene },
    nodeId: string,
    prevPos: { x: number; y: number },
    nextPos: { x: number; y: number }
  ) {
    this.sceneRef = sceneRef;
    this.nodeId = nodeId;
    this.prevPos = prevPos;
    this.nextPos = nextPos;
  }

  do() {
    const node = this.sceneRef.scene.nodes[this.nodeId];
    if (!node) return;

    // Update transform.position if it exists
    if (node.transform) {
      node.transform = {
        ...node.transform,
        position: { x: this.nextPos.x, y: this.nextPos.y },
      };
    }

    // Also update shape.position (renderer uses this)
    if (node.type === "shape") {
      const shape = (node as any).shape;
      if (shape && shape.position) {
        shape.position.x = this.nextPos.x;
        shape.position.y = this.nextPos.y;
      }
    }
  }

  undo() {
    const node = this.sceneRef.scene.nodes[this.nodeId];
    if (!node) return;

    // Update transform.position if it exists
    if (node.transform) {
      node.transform = {
        ...node.transform,
        position: { x: this.prevPos.x, y: this.prevPos.y },
      };
    }

    // Also update shape.position (renderer uses this)
    if (node.type === "shape") {
      const shape = (node as any).shape;
      if (shape && shape.position) {
        shape.position.x = this.prevPos.x;
        shape.position.y = this.prevPos.y;
      }
    }
  }
}


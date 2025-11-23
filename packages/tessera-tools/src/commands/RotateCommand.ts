import Command from "./Command";
import type { Scene } from "@tessera/core";

export class RotateCommand implements Command {
  private sceneRef: { scene: Scene };
  private nodeId: string;
  private prevRot: number;
  private nextRot: number;

  constructor(
    sceneRef: { scene: Scene },
    nodeId: string,
    prevRot: number,
    nextRot: number
  ) {
    this.sceneRef = sceneRef;
    this.nodeId = nodeId;
    this.prevRot = prevRot;
    this.nextRot = nextRot;
  }

  do() {
    const node = this.sceneRef.scene.nodes[this.nodeId];
    if (!node || !node.transform) return;

    node.transform = {
      ...node.transform,
      rotation: this.nextRot,
    };
  }

  undo() {
    const node = this.sceneRef.scene.nodes[this.nodeId];
    if (!node || !node.transform) return;

    node.transform = {
      ...node.transform,
      rotation: this.prevRot,
    };
  }
}


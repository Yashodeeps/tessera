import Command from "./Command";
import type { Scene } from "@tessera/core";


export class CreateShapeCommand implements Command {
  private sceneRef: { scene: Scene };
  private layerId: string;
  private nodeId: string;
  private nodeObj: any;

  constructor(
    sceneRef: { scene: Scene },
    layerId: string,
    nodeId: string,
    nodeObj: any
  ) {
    this.sceneRef = sceneRef;
    this.layerId = layerId;
    this.nodeId = nodeId;
    this.nodeObj = nodeObj;
  }

  do() {
    this.sceneRef.scene.nodes[this.nodeId] = this.nodeObj;
    const layer = this.sceneRef.scene.nodes[this.layerId];
    if (layer) {
      layer.children.push(this.nodeId);
    }
  }

  undo() {
    delete this.sceneRef.scene.nodes[this.nodeId];
    const layer = this.sceneRef.scene.nodes[this.layerId];
    if (layer) {
      layer.children = layer.children.filter((c: string) => c !== this.nodeId);
    }
  }
}


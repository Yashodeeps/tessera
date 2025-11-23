import Command from "./Command";
import type { Scene } from "@tessera/core";

export class DeleteCommand implements Command {
  private sceneRef: { scene: Scene };
  private nodeIds: string[];
  private deletedNodes: Map<string, any> = new Map();
  private parentChildren: Map<string, string[]> = new Map();

  constructor(sceneRef: { scene: Scene }, nodeIds: string[]) {
    this.sceneRef = sceneRef;
    this.nodeIds = nodeIds;
  }

  do() {
    for (const id of this.nodeIds) {
      const node = this.sceneRef.scene.nodes[id];
      if (!node) continue;

      // Store node for undo
      this.deletedNodes.set(id, { ...node });

      // Store parent's children
      if (node.parent) {
        const parent = this.sceneRef.scene.nodes[node.parent];
        if (parent) {
          this.parentChildren.set(node.parent, [...parent.children]);
          parent.children = parent.children.filter((c) => c !== id);
        }
      }

      // Remove from rootLayers if it's a layer
      if (node.type === "layer") {
        const index = this.sceneRef.scene.rootLayers.indexOf(id);
        if (index >= 0) {
          this.sceneRef.scene.rootLayers.splice(index, 1);
        }
      }

      // Delete node
      delete this.sceneRef.scene.nodes[id];
    }
  }

  undo() {
    // Restore nodes
    for (const [id, node] of this.deletedNodes) {
      this.sceneRef.scene.nodes[id] = node;

      // Restore parent's children
      if (node.parent) {
        const parent = this.sceneRef.scene.nodes[node.parent];
        if (parent) {
          const originalChildren = this.parentChildren.get(node.parent);
          if (originalChildren) {
            parent.children = originalChildren;
          }
        }
      }

      // Restore rootLayers
      if (node.type === "layer") {
        this.sceneRef.scene.rootLayers.push(id);
      }
    }
  }
}


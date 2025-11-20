import type { Store } from "../state/Store";
import { hitTestPoint } from "@tessera/geometry";
import type { Vec2 } from "@tessera/math";


type PointerEventListener = (payload: { nodeId: string | null; point: Vec2; original?: any }) => void;

export class EventManager {
  private store: Store;
  private pointerDownListeners: PointerEventListener[] = [];
  private pointerMoveListeners: PointerEventListener[] = [];
  private pointerUpListeners: PointerEventListener[] = [];

  constructor(store: Store) {
    this.store = store;
  }

  onPointerDown(fn: PointerEventListener) {
    this.pointerDownListeners.push(fn);
    return () => (this.pointerDownListeners = this.pointerDownListeners.filter(x => x !== fn));
  }
  onPointerMove(fn: PointerEventListener) {
    this.pointerMoveListeners.push(fn);
    return () => (this.pointerMoveListeners = this.pointerMoveListeners.filter(x => x !== fn));
  }
  onPointerUp(fn: PointerEventListener) {
    this.pointerUpListeners.push(fn);
    return () => (this.pointerUpListeners = this.pointerUpListeners.filter(x => x !== fn));
  }

  private findTopShapeAt(point: Vec2): string | null {
    const state = this.store.getState();
    const scene = state.scene;
    for (let li = scene.rootLayers.length - 1; li >= 0; li--) {
      const layerId = scene.rootLayers[li];
      if (!layerId) continue;
      const layer = scene.nodes[layerId];
      if (!layer) continue;
      const stack = [...layer.children].reverse(); // top to bottom within layer
      for (const nid of stack) {
        const node = scene.nodes[nid];
        if (!node) continue;
        // only shape nodes are hit-testable here; groups could be traversed deeper (skipped for simplicity)
        if (node.type === "shape") {
          // @ts-ignore shape typed as AnyShape
          const hit = hitTestPoint(node.shape, point);
          if (hit) return node.id;
        } else if (node.type === "group") {
          const shapeId = this.traverseGroupForHit(scene, node, point);
          if (shapeId) return shapeId;
        }
      }
    }
    return null;
  }

  private traverseGroupForHit(scene: any, group: any, point: Vec2): string | null {
    for (let i = group.children.length - 1; i >= 0; i--) {
      const nid = group.children[i];
      const node = scene.nodes[nid];
      if (!node) continue;
      if (node.type === "shape") {
        if (hitTestPoint(node.shape, point)) return node.id;
      } else if (node.type === "group") {
        const inner = this.traverseGroupForHit(scene, node, point);
        if (inner) return inner;
      }
    }
    return null;
  }

  pointerDown(point: Vec2, original?: any) {
    const id = this.findTopShapeAt(point);
    for (const l of this.pointerDownListeners) l({ nodeId: id, point, original });
  }

  pointerMove(point: Vec2, original?: any) {
    const id = this.findTopShapeAt(point);
    for (const l of this.pointerMoveListeners) l({ nodeId: id, point, original });
  }

  pointerUp(point: Vec2, original?: any) {
    const id = this.findTopShapeAt(point);
    for (const l of this.pointerUpListeners) l({ nodeId: id, point, original });
  }
}

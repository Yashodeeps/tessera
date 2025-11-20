import { describe, it, expect, beforeEach } from "vitest";
import { EventManager } from "../src/events/EventManager";
import { Store } from "../src/state/Store";
import { createLayer, createGroup, createShapeNode, addNode } from "../src/scene/SceneNode";
import { makeRect, makeCircle } from "@tessera/geometry";
import type { Scene } from "../src/types";

describe("EventManager", () => {
  let store: Store;
  let eventManager: EventManager;
  let scene: Scene;

  beforeEach(() => {
    scene = { nodes: {}, rootLayers: [] };
    store = new Store(scene);
    eventManager = new EventManager(store);
  });

  describe("onPointerDown", () => {
    it("should register and call pointer down listener", () => {
      let receivedPayload: { nodeId: string | null; point: { x: number; y: number }; original?: any } | null = null;
      const unsubscribe = eventManager.onPointerDown((payload) => {
        receivedPayload = payload;
      });

      eventManager.pointerDown({ x: 10, y: 10 });
      expect(receivedPayload).not.toBeNull();
      expect(receivedPayload!.point).toEqual({ x: 10, y: 10 });

      unsubscribe();
    });

    it("should allow unsubscribing", () => {
      let callCount = 0;
      const unsubscribe = eventManager.onPointerDown(() => {
        callCount++;
      });

      eventManager.pointerDown({ x: 10, y: 10 });
      expect(callCount).toBe(1);

      unsubscribe();
      eventManager.pointerDown({ x: 20, y: 20 });
      expect(callCount).toBe(1); // Should not increment
    });

    it("should support multiple listeners", () => {
      let count1 = 0;
      let count2 = 0;

      const unsubscribe1 = eventManager.onPointerDown(() => count1++);
      const unsubscribe2 = eventManager.onPointerDown(() => count2++);

      eventManager.pointerDown({ x: 10, y: 10 });
      expect(count1).toBe(1);
      expect(count2).toBe(1);

      unsubscribe1();
      unsubscribe2();
    });
  });

  describe("onPointerMove", () => {
    it("should register and call pointer move listener", () => {
      let receivedPayload: { nodeId: string | null; point: { x: number; y: number }; original?: any } | null = null;
      const unsubscribe = eventManager.onPointerMove((payload) => {
        receivedPayload = payload;
      });

      eventManager.pointerMove({ x: 15, y: 15 });
      expect(receivedPayload).not.toBeNull();
      expect(receivedPayload!.point).toEqual({ x: 15, y: 15 });

      unsubscribe();
    });
  });

  describe("onPointerUp", () => {
    it("should register and call pointer up listener", () => {
      let receivedPayload: { nodeId: string | null; point: { x: number; y: number }; original?: any } | null = null;
      const unsubscribe = eventManager.onPointerUp((payload) => {
        receivedPayload = payload;
      });

      eventManager.pointerUp({ x: 20, y: 20 });
      expect(receivedPayload).not.toBeNull();
      expect(receivedPayload!.point).toEqual({ x: 20, y: 20 });

      unsubscribe();
    });
  });

  describe("hit testing", () => {
    it("should find shape at point", () => {
      const layer = createLayer("layer1");
      const rect = makeRect(0, 0, 10, 10);
      const shape = createShapeNode("shape1", rect, "layer1");
      let scene = addNode({ nodes: {}, rootLayers: [] }, layer);
      scene = addNode(scene, shape);
      store.replaceScene(scene);

      let hitNodeId: string | null = null;
      eventManager.onPointerDown((payload) => {
        hitNodeId = payload.nodeId;
      });

      eventManager.pointerDown({ x: 5, y: 5 });
      expect(hitNodeId).toBe("shape1");
    });

    it("should return null when no shape at point", () => {
      const layer = createLayer("layer1");
      const rect = makeRect(0, 0, 10, 10);
      const shape = createShapeNode("shape1", rect, "layer1");
      let scene = addNode({ nodes: {}, rootLayers: [] }, layer);
      scene = addNode(scene, shape);
      store.replaceScene(scene);

      let hitNodeId: string | null = "not-null";
      eventManager.onPointerDown((payload) => {
        hitNodeId = payload.nodeId;
      });

      eventManager.pointerDown({ x: 50, y: 50 });
      expect(hitNodeId).toBe(null);
    });

    it("should find top-most shape when overlapping", () => {
      const layer = createLayer("layer1");
      const rect1 = makeRect(0, 0, 20, 20);
      const rect2 = makeRect(5, 5, 10, 10);
      const shape1 = createShapeNode("shape1", rect1, "layer1");
      const shape2 = createShapeNode("shape2", rect2, "layer1");
      let scene = addNode({ nodes: {}, rootLayers: [] }, layer);
      scene = addNode(scene, shape1);
      scene = addNode(scene, shape2);
      store.replaceScene(scene);

      let hitNodeId: string | null = null;
      eventManager.onPointerDown((payload) => {
        hitNodeId = payload.nodeId;
      });

      // Point is in both shapes, but shape2 should be on top
      eventManager.pointerDown({ x: 10, y: 10 });
      expect(hitNodeId).toBe("shape2");
    });

    it("should work with circles", () => {
      const layer = createLayer("layer1");
      const circle = makeCircle(10, 10, 5);
      const shape = createShapeNode("shape1", circle, "layer1");
      let scene = addNode({ nodes: {}, rootLayers: [] }, layer);
      scene = addNode(scene, shape);
      store.replaceScene(scene);

      let hitNodeId: string | null = null;
      eventManager.onPointerDown((payload) => {
        hitNodeId = payload.nodeId;
      });

      eventManager.pointerDown({ x: 10, y: 10 });
      expect(hitNodeId).toBe("shape1");

      eventManager.pointerDown({ x: 20, y: 20 });
      expect(hitNodeId).toBe(null);
    });
  });

  describe("group traversal", () => {
    it("should find shapes inside groups", () => {
      const layer = createLayer("layer1");
      const group = createGroup("group1", "layer1");
      const rect = makeRect(0, 0, 10, 10);
      const shape = createShapeNode("shape1", rect, "group1");
      let scene = addNode({ nodes: {}, rootLayers: [] }, layer);
      scene = addNode(scene, group);
      scene = addNode(scene, shape);
      store.replaceScene(scene);

      let hitNodeId: string | null = null;
      eventManager.onPointerDown((payload) => {
        hitNodeId = payload.nodeId;
      });

      eventManager.pointerDown({ x: 5, y: 5 });
      expect(hitNodeId).toBe("shape1");
    });
  });
});


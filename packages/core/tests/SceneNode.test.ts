import { describe, it, expect } from "vitest";
import {
  createLayer,
  createGroup,
  createShapeNode,
  addNode,
  removeNode,
} from "../src/scene/SceneNode";
import { makeRect } from "@tessera/geometry";
import type { Scene } from "../src/types";

describe("SceneNode", () => {
  describe("createLayer", () => {
    it("should create a layer node with correct properties", () => {
      const layer = createLayer("layer1");
      expect(layer.id).toBe("layer1");
      expect(layer.type).toBe("layer");
      expect(layer.parent).toBe(null);
      expect(layer.children).toEqual([]);
      expect(layer.transform?.position).toEqual({ x: 0, y: 0 });
      expect(layer.transform?.rotation).toBe(0);
      expect(layer.transform?.scale).toEqual({ x: 1, y: 1 });
    });
  });

  describe("createGroup", () => {
    it("should create a group node without parent", () => {
      const group = createGroup("group1");
      expect(group.id).toBe("group1");
      expect(group.type).toBe("group");
      expect(group.parent).toBe(null);
      expect(group.children).toEqual([]);
    });

    it("should create a group node with parent", () => {
      const group = createGroup("group1", "parent1");
      expect(group.id).toBe("group1");
      expect(group.type).toBe("group");
      expect(group.parent).toBe("parent1");
    });
  });

  describe("createShapeNode", () => {
    it("should create a shape node with rect", () => {
      const rect = makeRect(10, 20, 30, 40);
      const shape = createShapeNode("shape1", rect);
      expect(shape.id).toBe("shape1");
      expect(shape.type).toBe("shape");
      expect(shape.parent).toBe(null);
      expect(shape.children).toEqual([]);
      if (shape.type === "shape") {
        expect(shape.shape).toEqual(rect);
      }
    });

    it("should create a shape node with parent", () => {
      const rect = makeRect(0, 0, 10, 10);
      const shape = createShapeNode("shape1", rect, "parent1");
      expect(shape.parent).toBe("parent1");
    });

    it("should use shape position if provided", () => {
      const rect = makeRect(5, 5, 10, 10);
      const shape = createShapeNode("shape1", { ...rect, position: { x: 5, y: 5 } });
      expect(shape.transform?.position).toEqual({ x: 5, y: 5 });
    });
  });

  describe("addNode", () => {
    it("should add a layer to an empty scene", () => {
      const scene: Scene = { nodes: {}, rootLayers: [] };
      const layer = createLayer("layer1");
      const newScene = addNode(scene, layer);

      expect(newScene.nodes["layer1"]).toEqual(layer);
      expect(newScene.rootLayers).toEqual(["layer1"]);
    });

    it("should add a layer to existing scene", () => {
      const layer1 = createLayer("layer1");
      const scene: Scene = { nodes: { layer1 }, rootLayers: ["layer1"] };
      const layer2 = createLayer("layer2");
      const newScene = addNode(scene, layer2);

      expect(newScene.nodes["layer2"]).toEqual(layer2);
      expect(newScene.rootLayers).toEqual(["layer1", "layer2"]);
    });

    it("should not duplicate layer in rootLayers", () => {
      const layer1 = createLayer("layer1");
      const scene: Scene = { nodes: { layer1 }, rootLayers: ["layer1"] };
      const newScene = addNode(scene, layer1);

      expect(newScene.rootLayers).toEqual(["layer1"]);
    });

    it("should add a shape node with parent", () => {
      const group = createGroup("group1");
      const scene: Scene = { nodes: { group1: group }, rootLayers: [] };
      const rect = makeRect(0, 0, 10, 10);
      const shape = createShapeNode("shape1", rect, "group1");
      const newScene = addNode(scene, shape);

      expect(newScene.nodes["shape1"]).toEqual(shape);
      const parentNode = newScene.nodes["group1"];
      expect(parentNode).toBeDefined();
      if (parentNode) {
        expect(parentNode.children).toEqual(["shape1"]);
      }
    });

    it("should add multiple children to a parent", () => {
      const group = createGroup("group1");
      const scene: Scene = { nodes: { group1: group }, rootLayers: [] };
      const rect1 = makeRect(0, 0, 10, 10);
      const rect2 = makeRect(10, 10, 10, 10);
      const shape1 = createShapeNode("shape1", rect1, "group1");
      const shape2 = createShapeNode("shape2", rect2, "group1");

      let newScene = addNode(scene, shape1);
      newScene = addNode(newScene, shape2);

      const parentNode = newScene.nodes["group1"];
      expect(parentNode).toBeDefined();
      if (parentNode) {
        expect(parentNode.children).toEqual(["shape1", "shape2"]);
      }
    });
  });

  describe("removeNode", () => {
    it("should remove a node from scene", () => {
      const layer = createLayer("layer1");
      const scene: Scene = { nodes: { layer1: layer }, rootLayers: ["layer1"] };
      const newScene = removeNode(scene, "layer1");

      expect(newScene.nodes["layer1"]).toBeUndefined();
      expect(newScene.rootLayers).toEqual([]);
    });

    it("should remove node and its children", () => {
      const group = createGroup("group1");
      const rect = makeRect(0, 0, 10, 10);
      const shape = createShapeNode("shape1", rect, "group1");
      const scene: Scene = {
        nodes: { group1: group, shape1: shape },
        rootLayers: [],
      };
      // First add the shape to the group
      let newScene = addNode(scene, shape);
      // Then remove the group
      newScene = removeNode(newScene, "group1");

      expect(newScene.nodes["group1"]).toBeUndefined();
      expect(newScene.nodes["shape1"]).toBeUndefined();
    });

    it("should remove node from parent's children", () => {
      const group = createGroup("group1");
      const rect = makeRect(0, 0, 10, 10);
      const shape = createShapeNode("shape1", rect, "group1");
      let scene: Scene = { nodes: { group1: group }, rootLayers: [] };
      scene = addNode(scene, shape);
      scene = removeNode(scene, "shape1");

      expect(scene.nodes["shape1"]).toBeUndefined();
      const parentNode = scene.nodes["group1"];
      expect(parentNode).toBeDefined();
      if (parentNode) {
        expect(parentNode.children).toEqual([]);
      }
    });

    it("should handle removing non-existent node", () => {
      const scene: Scene = { nodes: {}, rootLayers: [] };
      const newScene = removeNode(scene, "nonexistent");

      expect(newScene).toEqual(scene);
    });
  });
});


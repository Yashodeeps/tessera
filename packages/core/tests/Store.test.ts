import { describe, it, expect, beforeEach } from "vitest";
import { Store } from "../src/state/Store";
import type { Scene } from "../src/types";

describe("Store", () => {
  let store: Store;
  let initialScene: Scene;

  beforeEach(() => {
    initialScene = { nodes: {}, rootLayers: [] };
    store = new Store(initialScene);
  });

  describe("constructor", () => {
    it("should initialize with default state", () => {
      const state = store.getState();
      expect(state.scene).toEqual(initialScene);
      expect(state.selection).toEqual([]);
      expect(state.viewport).toEqual({ x: 0, y: 0, zoom: 1 });
      expect(state.activeTool).toBe(null);
    });
  });

  describe("getState", () => {
    it("should return current state", () => {
      const state = store.getState();
      expect(state).toBeDefined();
      expect(state.scene).toEqual(initialScene);
    });
  });

  describe("subscribe", () => {
    it("should call listener when state changes", () => {
      let receivedState: ReturnType<typeof store.getState> | null = null;
      const unsubscribe = store.subscribe((state) => {
        receivedState = state;
      });

      store.setSelection(["node1"]);
      expect(receivedState).not.toBeNull();
      expect(receivedState!.selection).toEqual(["node1"]);

      unsubscribe();
    });

    it("should allow unsubscribing", () => {
      let callCount = 0;
      const unsubscribe = store.subscribe(() => {
        callCount++;
      });

      store.setSelection(["node1"]);
      expect(callCount).toBe(1);

      unsubscribe();
      store.setSelection(["node2"]);
      expect(callCount).toBe(1); // Should not increment
    });

    it("should support multiple subscribers", () => {
      let count1 = 0;
      let count2 = 0;

      const unsubscribe1 = store.subscribe(() => count1++);
      const unsubscribe2 = store.subscribe(() => count2++);

      store.setSelection(["node1"]);
      expect(count1).toBe(1);
      expect(count2).toBe(1);

      unsubscribe1();
      unsubscribe2();
    });
  });

  describe("update", () => {
    it("should update state and notify listeners", () => {
      let receivedState: ReturnType<typeof store.getState> | null = null;
      store.subscribe((state) => {
        receivedState = state;
      });

      store.update((s) => ({ ...s, activeTool: "pen" }));
      expect(receivedState).not.toBeNull();
      expect(receivedState!.activeTool).toBe("pen");
      expect(store.getState().activeTool).toBe("pen");
    });
  });

  describe("setSelection", () => {
    it("should update selection", () => {
      store.setSelection(["node1", "node2"]);
      expect(store.getState().selection).toEqual(["node1", "node2"]);
    });

    it("should notify subscribers", () => {
      let receivedSelection: string[] = [];
      store.subscribe((state) => {
        receivedSelection = state.selection;
      });

      store.setSelection(["node1"]);
      expect(receivedSelection).toEqual(["node1"]);
    });
  });

  describe("setViewport", () => {
    it("should update viewport", () => {
      store.setViewport({ x: 100, y: 200, zoom: 2 });
      const state = store.getState();
      expect(state.viewport).toEqual({ x: 100, y: 200, zoom: 2 });
    });

    it("should notify subscribers", () => {
      let receivedViewport = null;
      store.subscribe((state) => {
        receivedViewport = state.viewport;
      });

      store.setViewport({ x: 50, y: 75, zoom: 1.5 });
      expect(receivedViewport).toEqual({ x: 50, y: 75, zoom: 1.5 });
    });
  });

  describe("setActiveTool", () => {
    it("should update active tool", () => {
      store.setActiveTool("pen");
      expect(store.getState().activeTool).toBe("pen");
    });

    it("should allow setting tool to null", () => {
      store.setActiveTool("pen");
      store.setActiveTool(null);
      expect(store.getState().activeTool).toBe(null);
    });
  });

  describe("replaceScene", () => {
    it("should replace the entire scene", () => {
      const newScene: Scene = {
        nodes: { node1: { id: "node1", type: "layer", parent: null, children: [] } },
        rootLayers: ["node1"],
      };
      store.replaceScene(newScene);
      expect(store.getState().scene).toEqual(newScene);
    });

    it("should notify subscribers", () => {
      let receivedScene = null;
      store.subscribe((state) => {
        receivedScene = state.scene;
      });

      const newScene: Scene = { nodes: {}, rootLayers: [] };
      store.replaceScene(newScene);
      expect(receivedScene).toEqual(newScene);
    });
  });
});


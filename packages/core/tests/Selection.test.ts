import { describe, it, expect, beforeEach } from "vitest";
import { selectSingle, toggleSelection } from "../src/state/Selection";
import { Store } from "../src/state/Store";
import type { Scene } from "../src/types";

describe("Selection", () => {
  let store: Store;
  let initialScene: Scene;

  beforeEach(() => {
    initialScene = { nodes: {}, rootLayers: [] };
    store = new Store(initialScene);
  });

  describe("selectSingle", () => {
    it("should select a single node", () => {
      selectSingle(store, "node1");
      expect(store.getState().selection).toEqual(["node1"]);
    });

    it("should clear selection when id is null", () => {
      store.setSelection(["node1", "node2"]);
      selectSingle(store, null);
      expect(store.getState().selection).toEqual([]);
    });

    it("should replace existing selection", () => {
      store.setSelection(["node1"]);
      selectSingle(store, "node2");
      expect(store.getState().selection).toEqual(["node2"]);
    });
  });

  describe("toggleSelection", () => {
    it("should add node to selection if not selected", () => {
      store.setSelection(["node1"]);
      toggleSelection(store, "node2");
      expect(store.getState().selection).toEqual(["node1", "node2"]);
    });

    it("should remove node from selection if already selected", () => {
      store.setSelection(["node1", "node2"]);
      toggleSelection(store, "node1");
      expect(store.getState().selection).toEqual(["node2"]);
    });

    it("should add to empty selection", () => {
      store.setSelection([]);
      toggleSelection(store, "node1");
      expect(store.getState().selection).toEqual(["node1"]);
    });

    it("should remove last node from selection", () => {
      store.setSelection(["node1"]);
      toggleSelection(store, "node1");
      expect(store.getState().selection).toEqual([]);
    });
  });
});


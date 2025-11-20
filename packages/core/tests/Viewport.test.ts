import { describe, it, expect, beforeEach } from "vitest";
import { pan, zoomAt } from "../src/state/Viewport";
import { Store } from "../src/state/Store";
import type { Scene } from "../src/types";

describe("Viewport", () => {
  let store: Store;
  let initialScene: Scene;

  beforeEach(() => {
    initialScene = { nodes: {}, rootLayers: [] };
    store = new Store(initialScene);
  });

  describe("pan", () => {
    it("should pan viewport by delta", () => {
      store.setViewport({ x: 0, y: 0, zoom: 1 });
      pan(store, 10, 20);
      expect(store.getState().viewport).toEqual({ x: 10, y: 20, zoom: 1 });
    });

    it("should pan from existing position", () => {
      store.setViewport({ x: 100, y: 200, zoom: 1 });
      pan(store, 50, -30);
      expect(store.getState().viewport).toEqual({ x: 150, y: 170, zoom: 1 });
    });

    it("should handle negative deltas", () => {
      store.setViewport({ x: 100, y: 100, zoom: 1 });
      pan(store, -50, -25);
      expect(store.getState().viewport).toEqual({ x: 50, y: 75, zoom: 1 });
    });
  });

  describe("zoomAt", () => {
    it("should zoom by factor", () => {
      store.setViewport({ x: 0, y: 0, zoom: 1 });
      zoomAt(store, 2, 0, 0);
      expect(store.getState().viewport.zoom).toBe(2);
    });

    it("should zoom from existing zoom level", () => {
      store.setViewport({ x: 0, y: 0, zoom: 2 });
      zoomAt(store, 1.5, 0, 0);
      expect(store.getState().viewport.zoom).toBe(3);
    });

    it("should handle zoom out", () => {
      store.setViewport({ x: 0, y: 0, zoom: 2 });
      zoomAt(store, 0.5, 0, 0);
      expect(store.getState().viewport.zoom).toBe(1);
    });

    it("should preserve viewport position (current implementation)", () => {
      store.setViewport({ x: 100, y: 200, zoom: 1 });
      zoomAt(store, 2, 50, 75);
      const viewport = store.getState().viewport;
      expect(viewport.x).toBe(100);
      expect(viewport.y).toBe(200);
      expect(viewport.zoom).toBe(2);
    });
  });
});


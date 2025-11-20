import { describe, it, expect } from "vitest";
import { worldToScreen, screenToWorld, screenRectToWorldRect, type Viewport } from "../src/utils/viewport";

describe("viewport", () => {
  const viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  const canvasW = 800;
  const canvasH = 600;

  describe("worldToScreen", () => {
    it("should convert world coordinates to screen coordinates with zoom 1", () => {
      const result = worldToScreen(viewport, canvasW, canvasH, { x: 100, y: 50 });
      expect(result.x).toBe(100);
      expect(result.y).toBe(50);
    });

    it("should apply viewport offset", () => {
      const vp: Viewport = { x: 50, y: 25, zoom: 1 };
      const result = worldToScreen(vp, canvasW, canvasH, { x: 100, y: 50 });
      expect(result.x).toBe(50);
      expect(result.y).toBe(25);
    });

    it("should apply zoom factor", () => {
      const vp: Viewport = { x: 0, y: 0, zoom: 2 };
      const result = worldToScreen(vp, canvasW, canvasH, { x: 100, y: 50 });
      expect(result.x).toBe(200);
      expect(result.y).toBe(100);
    });

    it("should apply both offset and zoom", () => {
      const vp: Viewport = { x: 50, y: 25, zoom: 2 };
      const result = worldToScreen(vp, canvasW, canvasH, { x: 100, y: 50 });
      expect(result.x).toBe(100);
      expect(result.y).toBe(50);
    });
  });

  describe("screenToWorld", () => {
    it("should convert screen coordinates to world coordinates with zoom 1", () => {
      const result = screenToWorld(viewport, canvasW, canvasH, { x: 100, y: 50 });
      expect(result.x).toBe(100);
      expect(result.y).toBe(50);
    });

    it("should apply viewport offset", () => {
      const vp: Viewport = { x: 50, y: 25, zoom: 1 };
      const result = screenToWorld(vp, canvasW, canvasH, { x: 100, y: 50 });
      expect(result.x).toBe(150);
      expect(result.y).toBe(75);
    });

    it("should apply zoom factor", () => {
      const vp: Viewport = { x: 0, y: 0, zoom: 2 };
      const result = screenToWorld(vp, canvasW, canvasH, { x: 100, y: 50 });
      expect(result.x).toBe(50);
      expect(result.y).toBe(25);
    });

    it("should apply both offset and zoom", () => {
      const vp: Viewport = { x: 50, y: 25, zoom: 2 };
      const result = screenToWorld(vp, canvasW, canvasH, { x: 100, y: 50 });
      expect(result.x).toBe(100);
      expect(result.y).toBe(50);
    });
  });

  describe("screenRectToWorldRect", () => {
    it("should compute world rect for full canvas with zoom 1", () => {
      const result = screenRectToWorldRect(viewport, canvasW, canvasH);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.width).toBe(800);
      expect(result.height).toBe(600);
    });

    it("should apply viewport offset", () => {
      const vp: Viewport = { x: 100, y: 50, zoom: 1 };
      const result = screenRectToWorldRect(vp, canvasW, canvasH);
      expect(result.x).toBe(100);
      expect(result.y).toBe(50);
      expect(result.width).toBe(800);
      expect(result.height).toBe(600);
    });

    it("should apply zoom factor", () => {
      const vp: Viewport = { x: 0, y: 0, zoom: 2 };
      const result = screenRectToWorldRect(vp, canvasW, canvasH);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.width).toBe(400);
      expect(result.height).toBe(300);
    });

    it("should apply both offset and zoom", () => {
      const vp: Viewport = { x: 100, y: 50, zoom: 2 };
      const result = screenRectToWorldRect(vp, canvasW, canvasH);
      expect(result.x).toBe(100);
      expect(result.y).toBe(50);
      expect(result.width).toBe(400);
      expect(result.height).toBe(300);
    });
  });

  describe("round-trip conversion", () => {
    it("should convert world to screen and back correctly", () => {
      const vp: Viewport = { x: 50, y: 25, zoom: 2 };
      const worldPoint = { x: 100, y: 75 };
      const screenPoint = worldToScreen(vp, canvasW, canvasH, worldPoint);
      const backToWorld = screenToWorld(vp, canvasW, canvasH, screenPoint);
      expect(backToWorld.x).toBeCloseTo(worldPoint.x, 5);
      expect(backToWorld.y).toBeCloseTo(worldPoint.y, 5);
    });
  });
});


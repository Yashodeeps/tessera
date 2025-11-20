import { describe, it, expect, beforeEach, vi } from "vitest";
import { drawRect } from "../src/draw/drawRect";
import type { RectShape } from "../src/types";

describe("drawRect", () => {
  let mockCtx: CanvasRenderingContext2D;
  const viewport = { x: 0, y: 0, zoom: 1 };
  const canvasW = 800;
  const canvasH = 600;

  beforeEach(() => {
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  it("should draw a rect without rotation", () => {
    const shape: RectShape = {
      type: "rect",
      position: { x: 10, y: 20 },
      width: 100,
      height: 50,
    };

    drawRect(mockCtx, viewport, canvasW, canvasH, shape, {
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 1,
    });

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.fillRect).toHaveBeenCalledWith(10, 20, 100, 50);
    expect(mockCtx.strokeRect).toHaveBeenCalledWith(10, 20, 100, 50);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it("should apply zoom factor", () => {
    const vp = { x: 0, y: 0, zoom: 2 };
    const shape: RectShape = {
      type: "rect",
      position: { x: 10, y: 20 },
      width: 100,
      height: 50,
    };

    drawRect(mockCtx, vp, canvasW, canvasH, shape, { fill: "#ffffff" });

    expect(mockCtx.fillRect).toHaveBeenCalledWith(20, 40, 200, 100);
  });

  it("should apply scale", () => {
    const shape: RectShape = {
      type: "rect",
      position: { x: 10, y: 20 },
      width: 100,
      height: 50,
      scale: { x: 2, y: 1.5 },
    };

    drawRect(mockCtx, viewport, canvasW, canvasH, shape, { fill: "#ffffff" });

    expect(mockCtx.fillRect).toHaveBeenCalledWith(10, 20, 200, 75);
  });

  it("should apply rotation", () => {
    const shape: RectShape = {
      type: "rect",
      position: { x: 10, y: 20 },
      width: 100,
      height: 50,
      rotation: Math.PI / 4,
    };

    drawRect(mockCtx, viewport, canvasW, canvasH, shape, { fill: "#ffffff" });

    expect(mockCtx.translate).toHaveBeenCalled();
    expect(mockCtx.rotate).toHaveBeenCalledWith(Math.PI / 4);
  });

  it("should only fill when fill style provided", () => {
    const shape: RectShape = {
      type: "rect",
      position: { x: 10, y: 20 },
      width: 100,
      height: 50,
    };

    drawRect(mockCtx, viewport, canvasW, canvasH, shape, { fill: "#ffffff" });

    expect(mockCtx.fillRect).toHaveBeenCalled();
    expect(mockCtx.strokeRect).not.toHaveBeenCalled();
  });

  it("should only stroke when stroke style provided", () => {
    const shape: RectShape = {
      type: "rect",
      position: { x: 10, y: 20 },
      width: 100,
      height: 50,
    };

    drawRect(mockCtx, viewport, canvasW, canvasH, shape, { stroke: "#000000" });

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
    expect(mockCtx.strokeRect).toHaveBeenCalled();
  });
});


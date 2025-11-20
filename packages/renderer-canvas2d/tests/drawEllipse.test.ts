import { describe, it, expect, beforeEach, vi } from "vitest";
import { drawEllipse } from "../src/draw/drawEllipse";
import type { EllipseShape } from "../src/types";

describe("drawEllipse", () => {
  let mockCtx: CanvasRenderingContext2D;
  const viewport = { x: 0, y: 0, zoom: 1 };
  const canvasW = 800;
  const canvasH = 600;

  beforeEach(() => {
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      ellipse: vi.fn(),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      fill: vi.fn(),
      stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  it("should draw an ellipse", () => {
    const shape: EllipseShape = {
      type: "ellipse",
      position: { x: 100, y: 100 },
      rx: 50,
      ry: 30,
    };

    drawEllipse(mockCtx, viewport, canvasW, canvasH, shape, {
      fill: "#ffffff",
      stroke: "#000000",
    });

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.ellipse).toHaveBeenCalledWith(100, 100, 50, 30, 0, 0, Math.PI * 2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it("should apply zoom factor", () => {
    const vp = { x: 0, y: 0, zoom: 2 };
    const shape: EllipseShape = {
      type: "ellipse",
      position: { x: 100, y: 100 },
      rx: 50,
      ry: 30,
    };

    drawEllipse(mockCtx, vp, canvasW, canvasH, shape, { fill: "#ffffff" });

    expect(mockCtx.ellipse).toHaveBeenCalledWith(200, 200, 100, 60, 0, 0, Math.PI * 2);
  });

  it("should apply scale", () => {
    const shape: EllipseShape = {
      type: "ellipse",
      position: { x: 100, y: 100 },
      rx: 50,
      ry: 30,
      scale: { x: 2, y: 1.5 },
    };

    drawEllipse(mockCtx, viewport, canvasW, canvasH, shape, { fill: "#ffffff" });

    expect(mockCtx.ellipse).toHaveBeenCalledWith(100, 100, 100, 45, 0, 0, Math.PI * 2);
  });

  it("should apply rotation", () => {
    const shape: EllipseShape = {
      type: "ellipse",
      position: { x: 100, y: 100 },
      rx: 50,
      ry: 30,
      rotation: Math.PI / 4,
    };

    drawEllipse(mockCtx, viewport, canvasW, canvasH, shape, { fill: "#ffffff" });

    expect(mockCtx.ellipse).toHaveBeenCalledWith(100, 100, 50, 30, Math.PI / 4, 0, Math.PI * 2);
  });
});


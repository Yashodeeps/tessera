import { describe, it, expect, beforeEach, vi } from "vitest";
import { drawPolygon } from "../src/draw/drawPolygon";
import type { PolygonShape } from "../src/types";

describe("drawPolygon", () => {
  let mockCtx: CanvasRenderingContext2D;
  const viewport = { x: 0, y: 0, zoom: 1 };
  const canvasW = 800;
  const canvasH = 600;

  beforeEach(() => {
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      fill: vi.fn(),
      stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  it("should draw a polygon", () => {
    const shape: PolygonShape = {
      type: "polygon",
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ],
    };

    drawPolygon(mockCtx, viewport, canvasW, canvasH, shape, {
      fill: "#ffffff",
      stroke: "#000000",
    });

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(3);
    expect(mockCtx.closePath).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it("should return early for empty points", () => {
    const shape: PolygonShape = {
      type: "polygon",
      points: [],
    };

    drawPolygon(mockCtx, viewport, canvasW, canvasH, shape);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it("should apply zoom factor", () => {
    const vp = { x: 0, y: 0, zoom: 2 };
    const shape: PolygonShape = {
      type: "polygon",
      points: [{ x: 10, y: 20 }, { x: 30, y: 40 }],
    };

    drawPolygon(mockCtx, vp, canvasW, canvasH, shape, { fill: "#ffffff" });

    expect(mockCtx.moveTo).toHaveBeenCalledWith(20, 40);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(60, 80);
  });
});


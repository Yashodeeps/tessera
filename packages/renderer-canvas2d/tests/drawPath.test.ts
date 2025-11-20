import { describe, it, expect, beforeEach, vi } from "vitest";
import { drawPath } from "../src/draw/drawPath";
import type { PathShape } from "../src/types";

describe("drawPath", () => {
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
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      fill: vi.fn(),
      stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  it("should draw a path", () => {
    const shape: PathShape = {
      type: "path",
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
      ],
    };

    drawPath(mockCtx, viewport, canvasW, canvasH, shape, {
      fill: "#ffffff",
      stroke: "#000000",
    });

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(2);
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it("should return early for empty points", () => {
    const shape: PathShape = {
      type: "path",
      points: [],
    };

    drawPath(mockCtx, viewport, canvasW, canvasH, shape);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it("should not close path (unlike polygon)", () => {
    const shape: PathShape = {
      type: "path",
      points: [{ x: 0, y: 0 }, { x: 100, y: 0 }],
    };

    drawPath(mockCtx, viewport, canvasW, canvasH, shape, { stroke: "#000000" });

    expect(mockCtx.stroke).toHaveBeenCalled();
  });
});


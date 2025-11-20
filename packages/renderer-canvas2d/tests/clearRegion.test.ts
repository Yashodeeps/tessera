import { describe, it, expect, beforeEach, vi } from "vitest";
import { clearCanvas } from "../src/utils/clearRegion";

describe("clearRegion", () => {
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    mockCtx = {
      clearRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
  });

  it("should clear full canvas when no region specified", () => {
    clearCanvas(mockCtx, 800, 600);
    expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(mockCtx.clearRect).toHaveBeenCalledTimes(1);
  });

  it("should clear specified region", () => {
    clearCanvas(mockCtx, 800, 600, { x: 100, y: 50, w: 200, h: 150 });
    expect(mockCtx.clearRect).toHaveBeenCalledWith(100, 50, 200, 150);
    expect(mockCtx.clearRect).toHaveBeenCalledTimes(1);
  });

  it("should handle zero-sized region", () => {
    clearCanvas(mockCtx, 800, 600, { x: 100, y: 50, w: 0, h: 0 });
    expect(mockCtx.clearRect).toHaveBeenCalledWith(100, 50, 0, 0);
  });
});


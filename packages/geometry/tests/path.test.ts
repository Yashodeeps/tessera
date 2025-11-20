import { describe, it, expect } from "vitest";
import { subdivideLine } from "../src/utils/path";

describe("Path", () => {
  describe("subdivideLine", () => {
    it("should subdivide a horizontal line into segments", () => {
      const points = subdivideLine({ x: 0, y: 0 }, { x: 10, y: 0 }, 2);
      expect(points).toHaveLength(3);
      expect(points[0]).toEqual({ x: 0, y: 0 });
      expect(points[1]).toEqual({ x: 5, y: 0 });
      expect(points[2]).toEqual({ x: 10, y: 0 });
    });

    it("should subdivide a vertical line into segments", () => {
      const points = subdivideLine({ x: 0, y: 0 }, { x: 0, y: 10 }, 3);
      expect(points).toHaveLength(4);
      expect(points[0]).toEqual({ x: 0, y: 0 });
      expect(points[1]!.x).toBeCloseTo(0, 10);
      expect(points[1]!.y).toBeCloseTo(10 / 3, 10);
      expect(points[2]!.x).toBeCloseTo(0, 10);
      expect(points[2]!.y).toBeCloseTo(20 / 3, 10);
      expect(points[3]).toEqual({ x: 0, y: 10 });
    });

    it("should subdivide a diagonal line into segments", () => {
      const points = subdivideLine({ x: 0, y: 0 }, { x: 10, y: 10 }, 4);
      expect(points).toHaveLength(5);
      expect(points[0]).toEqual({ x: 0, y: 0 });
      expect(points[1]).toEqual({ x: 2.5, y: 2.5 });
      expect(points[2]).toEqual({ x: 5, y: 5 });
      expect(points[3]).toEqual({ x: 7.5, y: 7.5 });
      expect(points[4]).toEqual({ x: 10, y: 10 });
    });

    it("should return start and end points when segments is 0", () => {
      const points = subdivideLine({ x: 0, y: 0 }, { x: 10, y: 10 }, 0);
      expect(points).toHaveLength(1);
      expect(points[0]).toEqual({ x: 0, y: 0 });
    });

    it("should return start and end points when segments is 1", () => {
      const points = subdivideLine({ x: 0, y: 0 }, { x: 10, y: 10 }, 1);
      expect(points).toHaveLength(2);
      expect(points[0]).toEqual({ x: 0, y: 0 });
      expect(points[1]).toEqual({ x: 10, y: 10 });
    });

    it("should work with negative coordinates", () => {
      const points = subdivideLine({ x: -10, y: -10 }, { x: 10, y: 10 }, 2);
      expect(points).toHaveLength(3);
      expect(points[0]).toEqual({ x: -10, y: -10 });
      expect(points[1]).toEqual({ x: 0, y: 0 });
      expect(points[2]).toEqual({ x: 10, y: 10 });
    });

    it("should work with many segments", () => {
      const points = subdivideLine({ x: 0, y: 0 }, { x: 100, y: 0 }, 10);
      expect(points).toHaveLength(11);
      expect(points[0]).toEqual({ x: 0, y: 0 });
      expect(points[5]).toEqual({ x: 50, y: 0 });
      expect(points[10]).toEqual({ x: 100, y: 0 });
    });

    it("should handle degenerate line (same start and end)", () => {
      const points = subdivideLine({ x: 5, y: 5 }, { x: 5, y: 5 }, 5);
      expect(points).toHaveLength(6);
      points.forEach((point) => {
        expect(point).toEqual({ x: 5, y: 5 });
      });
    });

    it("should work with non-integer coordinates", () => {
      const points = subdivideLine({ x: 0.5, y: 0.5 }, { x: 2.5, y: 1.5 }, 2);
      expect(points).toHaveLength(3);
      expect(points[0]).toEqual({ x: 0.5, y: 0.5 });
      expect(points[1]).toEqual({ x: 1.5, y: 1.0 });
      expect(points[2]).toEqual({ x: 2.5, y: 1.5 });
    });
  });
});


import { describe, it, expect } from "vitest";
import { bboxOfPoints, bboxContainsPoint, BBox } from "../src/utils/bbox";

describe("BBox", () => {
  describe("bboxOfPoints", () => {
    it("should create a bbox from a single point", () => {
      const bbox = bboxOfPoints([{ x: 5, y: 5 }]);
      expect(bbox).toEqual({
        minX: 5,
        minY: 5,
        maxX: 5,
        maxY: 5,
      });
    });

    it("should create a bbox from multiple points", () => {
      const bbox = bboxOfPoints([
        { x: 0, y: 0 },
        { x: 10, y: 5 },
        { x: 5, y: 10 },
      ]);
      expect(bbox).toEqual({
        minX: 0,
        minY: 0,
        maxX: 10,
        maxY: 10,
      });
    });

    it("should work with negative coordinates", () => {
      const bbox = bboxOfPoints([
        { x: -10, y: -5 },
        { x: 5, y: 10 },
        { x: 0, y: 0 },
      ]);
      expect(bbox).toEqual({
        minX: -10,
        minY: -5,
        maxX: 5,
        maxY: 10,
      });
    });

    it("should handle empty array", () => {
      const bbox = bboxOfPoints([]);
      expect(bbox).toEqual({
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
      });
    });

    it("should handle duplicate points", () => {
      const bbox = bboxOfPoints([
        { x: 5, y: 5 },
        { x: 5, y: 5 },
        { x: 5, y: 5 },
      ]);
      expect(bbox).toEqual({
        minX: 5,
        minY: 5,
        maxX: 5,
        maxY: 5,
      });
    });
  });

  describe("bboxContainsPoint", () => {
    it("should return true for a point inside the bbox", () => {
      const bbox: BBox = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
      expect(bboxContainsPoint(bbox, { x: 5, y: 5 })).toBe(true);
    });

    it("should return true for a point on the left edge", () => {
      const bbox: BBox = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
      expect(bboxContainsPoint(bbox, { x: 0, y: 5 })).toBe(true);
    });

    it("should return true for a point on the right edge", () => {
      const bbox: BBox = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
      expect(bboxContainsPoint(bbox, { x: 10, y: 5 })).toBe(true);
    });

    it("should return true for a point on the top edge", () => {
      const bbox: BBox = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
      expect(bboxContainsPoint(bbox, { x: 5, y: 0 })).toBe(true);
    });

    it("should return true for a point on the bottom edge", () => {
      const bbox: BBox = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
      expect(bboxContainsPoint(bbox, { x: 5, y: 10 })).toBe(true);
    });

    it("should return true for a point at a corner", () => {
      const bbox: BBox = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
      expect(bboxContainsPoint(bbox, { x: 0, y: 0 })).toBe(true);
      expect(bboxContainsPoint(bbox, { x: 10, y: 10 })).toBe(true);
    });

    it("should return false for a point outside the bbox", () => {
      const bbox: BBox = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
      expect(bboxContainsPoint(bbox, { x: 15, y: 5 })).toBe(false);
      expect(bboxContainsPoint(bbox, { x: 5, y: 15 })).toBe(false);
      expect(bboxContainsPoint(bbox, { x: -1, y: 5 })).toBe(false);
      expect(bboxContainsPoint(bbox, { x: 5, y: -1 })).toBe(false);
    });

    it("should work with negative coordinates", () => {
      const bbox: BBox = { minX: -10, minY: -10, maxX: 10, maxY: 10 };
      expect(bboxContainsPoint(bbox, { x: 0, y: 0 })).toBe(true);
      expect(bboxContainsPoint(bbox, { x: -5, y: -5 })).toBe(true);
      expect(bboxContainsPoint(bbox, { x: 10, y: 10 })).toBe(true);
      expect(bboxContainsPoint(bbox, { x: -15, y: 0 })).toBe(false);
      expect(bboxContainsPoint(bbox, { x: 15, y: 0 })).toBe(false);
    });
  });
});


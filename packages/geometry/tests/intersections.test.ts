import { describe, it, expect } from "vitest";
import { lineLineIntersection, circleRectIntersect } from "../src/utils/intersections";
import { makeCircle } from "../src/shapes/Circle";
import { makeRect } from "../src/shapes/Rect";

describe("Intersections", () => {
  describe("lineLineIntersection", () => {
    it("should find the intersection of two intersecting lines", () => {
      // Two lines that intersect at (5, 5)
      const result = lineLineIntersection(
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
        { x: 10, y: 0 }
      );
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.x).toBeCloseTo(5, 5);
        expect(result.y).toBeCloseTo(5, 5);
      }
    });

    it("should return null for parallel lines", () => {
      const result = lineLineIntersection(
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 10 },
        { x: 10, y: 10 }
      );
      expect(result).toBeNull();
    });

    it("should return null for collinear lines", () => {
      const result = lineLineIntersection(
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 5, y: 0 },
        { x: 15, y: 0 }
      );
      expect(result).toBeNull();
    });

    it("should find intersection of vertical and horizontal lines", () => {
      const result = lineLineIntersection(
        { x: 5, y: 0 },
        { x: 5, y: 10 },
        { x: 0, y: 5 },
        { x: 10, y: 5 }
      );
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.x).toBeCloseTo(5, 5);
        expect(result.y).toBeCloseTo(5, 5);
      }
    });

    it("should work with lines that extend beyond segments", () => {
      const result = lineLineIntersection(
        { x: 0, y: 0 },
        { x: 2, y: 2 },
        { x: 10, y: 0 },
        { x: 8, y: 2 }
      );
      
      // These lines would intersect at (5, 5) if extended
      expect(result).not.toBeNull();
      if (result) {
        expect(result.x).toBeCloseTo(5, 5);
        expect(result.y).toBeCloseTo(5, 5);
      }
    });

    it("should handle lines with negative coordinates", () => {
      const result = lineLineIntersection(
        { x: -5, y: -5 },
        { x: 5, y: 5 },
        { x: -5, y: 5 },
        { x: 5, y: -5 }
      );
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(0, 5);
      }
    });
  });

  describe("circleRectIntersect", () => {
    it("should return true when circle completely overlaps rect", () => {
      const circle = makeCircle(5, 5, 10);
      const rect = makeRect(0, 0, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(true);
    });

    it("should return true when circle overlaps rect at corner", () => {
      const circle = makeCircle(0, 0, 5);
      const rect = makeRect(2, 2, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(true);
    });

    it("should return true when circle overlaps rect on edge", () => {
      const circle = makeCircle(5, 0, 5);
      const rect = makeRect(0, 0, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(true);
    });

    it("should return true when rect is completely inside circle", () => {
      const circle = makeCircle(5, 5, 20);
      const rect = makeRect(0, 0, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(true);
    });

    it("should return true when circle is completely inside rect", () => {
      const circle = makeCircle(5, 5, 2);
      const rect = makeRect(0, 0, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(true);
    });

    it("should return false when circle and rect do not overlap", () => {
      const circle = makeCircle(20, 20, 5);
      const rect = makeRect(0, 0, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(false);
    });

    it("should return false when circle is near but not touching rect", () => {
      const circle = makeCircle(15, 5, 4);
      const rect = makeRect(0, 0, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(false);
    });

    it("should return true when circle barely touches rect corner", () => {
      const circle = makeCircle(10, 10, 5);
      const rect = makeRect(0, 0, 10, 10);
      // Distance from circle center (10, 10) to rect corner (10, 10) is 0
      // So radius 5 should intersect
      expect(circleRectIntersect(circle, rect)).toBe(true);
    });

    it("should work with negative coordinates", () => {
      const circle = makeCircle(-5, -5, 5);
      const rect = makeRect(-10, -10, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(true);
    });

    it("should work when circle center is inside rect", () => {
      const circle = makeCircle(5, 5, 2);
      const rect = makeRect(0, 0, 10, 10);
      expect(circleRectIntersect(circle, rect)).toBe(true);
    });
  });
});


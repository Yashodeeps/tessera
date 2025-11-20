import { describe, it, expect } from "vitest";
import { makeCircle, circleContainsPoint, Circle } from "../src/shapes/Circle";

describe("Circle", () => {
  describe("makeCircle", () => {
    it("should create a circle with correct properties", () => {
      const circle = makeCircle(10, 20, 5);
      expect(circle.cx).toBe(10);
      expect(circle.cy).toBe(20);
      expect(circle.r).toBe(5);
    });
  });

  describe("circleContainsPoint", () => {
    it("should return true for a point at the center", () => {
      const circle = makeCircle(0, 0, 5);
      expect(circleContainsPoint(circle, { x: 0, y: 0 })).toBe(true);
    });

    it("should return true for a point inside the circle", () => {
      const circle = makeCircle(0, 0, 5);
      expect(circleContainsPoint(circle, { x: 2, y: 2 })).toBe(true);
      expect(circleContainsPoint(circle, { x: 3, y: 0 })).toBe(true);
      expect(circleContainsPoint(circle, { x: 0, y: 3 })).toBe(true);
    });

    it("should return true for a point exactly on the edge", () => {
      const circle = makeCircle(0, 0, 5);
      expect(circleContainsPoint(circle, { x: 5, y: 0 })).toBe(true);
      expect(circleContainsPoint(circle, { x: 0, y: 5 })).toBe(true);
      expect(circleContainsPoint(circle, { x: 3, y: 4 })).toBe(true); // 3-4-5 triangle
    });

    it("should return false for a point outside the circle", () => {
      const circle = makeCircle(0, 0, 5);
      expect(circleContainsPoint(circle, { x: 6, y: 0 })).toBe(false);
      expect(circleContainsPoint(circle, { x: 0, y: 6 })).toBe(false);
      expect(circleContainsPoint(circle, { x: 10, y: 10 })).toBe(false);
    });

    it("should work with non-zero center", () => {
      const circle = makeCircle(10, 20, 5);
      expect(circleContainsPoint(circle, { x: 10, y: 20 })).toBe(true);
      expect(circleContainsPoint(circle, { x: 15, y: 20 })).toBe(true);
      expect(circleContainsPoint(circle, { x: 16, y: 20 })).toBe(false);
      expect(circleContainsPoint(circle, { x: 10, y: 25 })).toBe(true);
      expect(circleContainsPoint(circle, { x: 10, y: 26 })).toBe(false);
    });

    it("should work with negative coordinates", () => {
      const circle = makeCircle(-10, -10, 5);
      expect(circleContainsPoint(circle, { x: -10, y: -10 })).toBe(true);
      expect(circleContainsPoint(circle, { x: -5, y: -10 })).toBe(true);
      expect(circleContainsPoint(circle, { x: -4, y: -10 })).toBe(false);
    });
  });
});


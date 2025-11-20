import { describe, it, expect } from "vitest";
import { makeLine, lineLength, linePointAt, Line } from "../src/shapes/Line";

describe("Line", () => {
  describe("makeLine", () => {
    it("should create a line with two points", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 10, y: 10 });
      expect(line.a).toEqual({ x: 0, y: 0 });
      expect(line.b).toEqual({ x: 10, y: 10 });
    });
  });

  describe("lineLength", () => {
    it("should calculate the length of a horizontal line", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 10, y: 0 });
      expect(lineLength(line)).toBe(10);
    });

    it("should calculate the length of a vertical line", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 0, y: 10 });
      expect(lineLength(line)).toBe(10);
    });

    it("should calculate the length of a diagonal line", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 3, y: 4 });
      expect(lineLength(line)).toBe(5); // 3-4-5 triangle
    });

    it("should return 0 for a degenerate line", () => {
      const line = makeLine({ x: 5, y: 5 }, { x: 5, y: 5 });
      expect(lineLength(line)).toBe(0);
    });

    it("should work with negative coordinates", () => {
      const line = makeLine({ x: -10, y: -10 }, { x: -5, y: -10 });
      expect(lineLength(line)).toBe(5);
    });
  });

  describe("linePointAt", () => {
    it("should return the start point at t=0", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point = linePointAt(line, 0);
      expect(point).toEqual({ x: 0, y: 0 });
    });

    it("should return the end point at t=1", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point = linePointAt(line, 1);
      expect(point).toEqual({ x: 10, y: 10 });
    });

    it("should return the midpoint at t=0.5", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point = linePointAt(line, 0.5);
      expect(point).toEqual({ x: 5, y: 5 });
    });

    it("should interpolate correctly at different t values", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 100, y: 0 });
      expect(linePointAt(line, 0.25)).toEqual({ x: 25, y: 0 });
      expect(linePointAt(line, 0.75)).toEqual({ x: 75, y: 0 });
    });

    it("should work with vertical lines", () => {
      const line = makeLine({ x: 5, y: 0 }, { x: 5, y: 100 });
      const point = linePointAt(line, 0.5);
      expect(point).toEqual({ x: 5, y: 50 });
    });

    it("should work with negative coordinates", () => {
      const line = makeLine({ x: -10, y: -10 }, { x: 10, y: 10 });
      const point = linePointAt(line, 0.5);
      expect(point).toEqual({ x: 0, y: 0 });
    });

    it("should work with t values outside [0, 1]", () => {
      const line = makeLine({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point1 = linePointAt(line, -0.5);
      expect(point1).toEqual({ x: -5, y: -5 });
      
      const point2 = linePointAt(line, 1.5);
      expect(point2).toEqual({ x: 15, y: 15 });
    });
  });
});


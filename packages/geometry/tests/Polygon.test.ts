import { describe, it, expect } from "vitest";
import { makePolygon, polygonArea, Polygon } from "../src/shapes/Polygon";

describe("Polygon", () => {
  describe("makePolygon", () => {
    it("should create a polygon with given points", () => {
      const points = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ];
      const polygon = makePolygon(points);
      expect(polygon.points).toEqual(points);
    });
  });

  describe("polygonArea", () => {
    it("should calculate the area of a square", () => {
      const polygon = makePolygon([
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ]);
      expect(polygonArea(polygon)).toBe(100);
    });

    it("should calculate the area of a rectangle", () => {
      const polygon = makePolygon([
        { x: 0, y: 0 },
        { x: 20, y: 0 },
        { x: 20, y: 10 },
        { x: 0, y: 10 },
      ]);
      expect(polygonArea(polygon)).toBe(200);
    });

    it("should calculate the area of a triangle", () => {
      const polygon = makePolygon([
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 5, y: 10 },
      ]);
      expect(polygonArea(polygon)).toBe(50);
    });

    it("should calculate the area correctly regardless of winding order (clockwise)", () => {
      const polygon = makePolygon([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 10, y: 0 },
      ]);
      const area = polygonArea(polygon);
      expect(area).toBe(50);
    });

    it("should calculate the area correctly regardless of winding order (counter-clockwise)", () => {
      const polygon = makePolygon([
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ]);
      const area = polygonArea(polygon);
      expect(area).toBe(50);
    });

    it("should work with negative coordinates", () => {
      const polygon = makePolygon([
        { x: -5, y: -5 },
        { x: 5, y: -5 },
        { x: 5, y: 5 },
        { x: -5, y: 5 },
      ]);
      expect(polygonArea(polygon)).toBe(100);
    });

    it("should work with complex polygons", () => {
      // L-shaped polygon
      const polygon = makePolygon([
        { x: 0, y: 0 },
        { x: 20, y: 0 },
        { x: 20, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: 20 },
        { x: 0, y: 20 },
      ]);
      expect(polygonArea(polygon)).toBe(300);
    });

    it("should return 0 for degenerate polygons", () => {
      const polygon = makePolygon([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ]);
      expect(polygonArea(polygon)).toBe(0);
    });

    it("should work with a single point (edge case)", () => {
      const polygon = makePolygon([{ x: 0, y: 0 }]);
      expect(polygonArea(polygon)).toBe(0);
    });

    it("should work with two points (edge case - line)", () => {
      const polygon = makePolygon([
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ]);
      expect(polygonArea(polygon)).toBe(0);
    });
  });
});


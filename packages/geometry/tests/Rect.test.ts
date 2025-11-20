import { describe, it, expect } from "vitest";
import { makeRect, rectContainsPoint, rectCenter, rectToPolygon, Rect } from "../src/shapes/Rect";

describe("Rect", () => {
  describe("makeRect", () => {
    it("should create a rect with correct properties", () => {
      const rect = makeRect(10, 20, 30, 40);
      expect(rect.x).toBe(10);
      expect(rect.y).toBe(20);
      expect(rect.width).toBe(30);
      expect(rect.height).toBe(40);
    });
  });

  describe("rectContainsPoint", () => {
    it("should return true for a point inside the rect", () => {
      const rect = makeRect(0, 0, 10, 10);
      expect(rectContainsPoint(rect, { x: 5, y: 5 })).toBe(true);
    });

    it("should return true for a point on the left edge", () => {
      const rect = makeRect(0, 0, 10, 10);
      expect(rectContainsPoint(rect, { x: 0, y: 5 })).toBe(true);
    });

    it("should return true for a point on the right edge", () => {
      const rect = makeRect(0, 0, 10, 10);
      expect(rectContainsPoint(rect, { x: 10, y: 5 })).toBe(true);
    });

    it("should return true for a point on the top edge", () => {
      const rect = makeRect(0, 0, 10, 10);
      expect(rectContainsPoint(rect, { x: 5, y: 0 })).toBe(true);
    });

    it("should return true for a point on the bottom edge", () => {
      const rect = makeRect(0, 0, 10, 10);
      expect(rectContainsPoint(rect, { x: 5, y: 10 })).toBe(true);
    });

    it("should return false for a point outside the rect", () => {
      const rect = makeRect(0, 0, 10, 10);
      expect(rectContainsPoint(rect, { x: 15, y: 5 })).toBe(false);
      expect(rectContainsPoint(rect, { x: 5, y: 15 })).toBe(false);
      expect(rectContainsPoint(rect, { x: -1, y: 5 })).toBe(false);
      expect(rectContainsPoint(rect, { x: 5, y: -1 })).toBe(false);
    });

    it("should work with negative coordinates", () => {
      const rect = makeRect(-10, -10, 20, 20);
      expect(rectContainsPoint(rect, { x: 0, y: 0 })).toBe(true);
      expect(rectContainsPoint(rect, { x: -5, y: -5 })).toBe(true);
      expect(rectContainsPoint(rect, { x: 10, y: 10 })).toBe(true);
      expect(rectContainsPoint(rect, { x: -15, y: 0 })).toBe(false);
    });
  });

  describe("rectCenter", () => {
    it("should return the center point of a rect", () => {
      const rect = makeRect(0, 0, 10, 10);
      const center = rectCenter(rect);
      expect(center.x).toBe(5);
      expect(center.y).toBe(5);
    });

    it("should work with non-zero origin", () => {
      const rect = makeRect(10, 20, 30, 40);
      const center = rectCenter(rect);
      expect(center.x).toBe(25);
      expect(center.y).toBe(40);
    });

    it("should work with negative coordinates", () => {
      const rect = makeRect(-10, -10, 20, 20);
      const center = rectCenter(rect);
      expect(center.x).toBe(0);
      expect(center.y).toBe(0);
    });
  });

  describe("rectToPolygon", () => {
    it("should convert a rect to a polygon with 4 points", () => {
      const rect = makeRect(0, 0, 10, 10);
      const polygon = rectToPolygon(rect);
      expect(polygon).toHaveLength(4);
    });

    it("should create correct polygon points in clockwise order", () => {
      const rect = makeRect(10, 20, 30, 40);
      const polygon = rectToPolygon(rect);
      
      expect(polygon[0]).toEqual({ x: 10, y: 20 });
      expect(polygon[1]).toEqual({ x: 40, y: 20 });
      expect(polygon[2]).toEqual({ x: 40, y: 60 });
      expect(polygon[3]).toEqual({ x: 10, y: 60 });
    });

    it("should work with negative coordinates", () => {
      const rect = makeRect(-10, -10, 20, 20);
      const polygon = rectToPolygon(rect);
      
      expect(polygon[0]).toEqual({ x: -10, y: -10 });
      expect(polygon[1]).toEqual({ x: 10, y: -10 });
      expect(polygon[2]).toEqual({ x: 10, y: 10 });
      expect(polygon[3]).toEqual({ x: -10, y: 10 });
    });
  });
});


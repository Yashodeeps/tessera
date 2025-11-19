import { describe, it, expect } from "vitest";
import { rect, containsPoint, intersects, union, fromPoints, center } from "../src/rect";

describe("rect", () => {
  it("contains and intersects", () => {
    const a = rect(0, 0, 10, 10);
    const b = rect(5, 5, 10, 10);
    expect(containsPoint(a, { x: 1, y: 1 })).toBeTruthy();
    expect(intersects(a, b)).toBeTruthy();
  });

  it("union and fromPoints", () => {
    const a = rect(0, 0, 10, 10);
    const b = rect(20, 20, 2, 2);
    const u = union(a, b);
    expect(u.x).toBe(0);
    expect(u.y).toBe(0);
    expect(u.width).toBeGreaterThan(20);
    const f = fromPoints([{ x: 0, y: 0 }, { x: 5, y: 10 }]);
    expect(f.width).toBe(5);
    expect(f.height).toBe(10);
  });

  it("center", () => {
    const r = rect(0, 0, 10, 10);
    expect(center(r)).toEqual({ x: 5, y: 5 });
  });
});

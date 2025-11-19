import { describe, it, expect } from "vitest";
import { vec2, add, sub, scale, length, normalize, equals, distance, rotate, fromAngle } from "../src/vec2";

describe("vec2", () => {
  it("add/sub/scale", () => {
    const a = vec2(1, 2);
    const b = vec2(3, 4);
    expect(add(a, b)).toEqual({ x: 4, y: 6 });
    expect(sub(b, a)).toEqual({ x: 2, y: 2 });
    expect(scale(a, 2)).toEqual({ x: 2, y: 4 });
  });

  it("length and normalize", () => {
    const a = vec2(3, 4);
    expect(length(a)).toBeCloseTo(5);
    const n = normalize(a);
    expect(Math.hypot(n.x, n.y)).toBeCloseTo(1);
  });

  it("distance and equals", () => {
    const a = vec2(0, 0);
    const b = vec2(1, 1);
    expect(distance(a, b)).toBeCloseTo(Math.SQRT2);
    expect(equals(a, vec2(0, 0))).toBeTruthy();
  });

  it("rotate and fromAngle", () => {
    const p = vec2(1, 0);
    const r = rotate(p, Math.PI / 2);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(1);
    const f = fromAngle(Math.PI / 2, 2);
    expect(f.x).toBeCloseTo(0);
    expect(f.y).toBeCloseTo(2);
  });
});

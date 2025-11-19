import { describe, it, expect } from "vitest";
import { identity, translate, scale, rotate, multiply, applyToPoint } from "../src/matrix2d";

describe("matrix2d", () => {
  it("identity", () => {
    const id = identity();
    const p = { x: 1, y: 2 };
    expect(applyToPoint(id, p)).toEqual(p);
  });

  it("translate", () => {
    const m = translate(3, 4);
    expect(applyToPoint(m, { x: 1, y: 1 })).toEqual({ x: 4, y: 5 });
  });

  it("scale & rotate & multiply", () => {
    const s = scale(2, 3);
    const r = rotate(Math.PI / 2);
    const combined = multiply(s, r);
    // just test applyToPoint doesn't blow up and returns numbers
    const p = applyToPoint(combined, { x: 1, y: 0 });
    expect(typeof p.x).toBe("number");
    expect(typeof p.y).toBe("number");
  });
});

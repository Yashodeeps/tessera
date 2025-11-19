import { Mat2D, Vec2 } from "./types";


export const identity = (): Mat2D => [1, 0, 0, 1, 0, 0];

export const multiply = (m1: Mat2D, m2: Mat2D): Mat2D => {
  const [a1, b1, c1, d1, e1, f1] = m1;
  const [a2, b2, c2, d2, e2, f2] = m2;

  return [
    a1 * a2 + c1 * b2,
    b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2,
    b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1,
    b1 * e2 + d1 * f2 + f1
  ];
};

export const translate = (tx: number, ty: number): Mat2D => [1, 0, 0, 1, tx, ty];

export const scale = (sx: number, sy = sx): Mat2D => [sx, 0, 0, sy, 0, 0];

export const rotate = (angleRad: number): Mat2D => {
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);
  return [c, s, -s, c, 0, 0];
};

export const applyToPoint = (m: Mat2D, p: Vec2): Vec2 => {
  const [a, b, c, d, e, f] = m;
  return {
    x: p.x * a + p.y * c + e,
    y: p.x * b + p.y * d + f
  };
};

export const invert = (m: Mat2D): Mat2D | null => {
  const [a, b, c, d, e, f] = m;
  const det = a * d - b * c;
  if (Math.abs(det) < 1e-12) return null;
  const invDet = 1 / det;
  const na = d * invDet;
  const nb = -b * invDet;
  const nc = -c * invDet;
  const nd = a * invDet;
  const ne = (c * f - d * e) * invDet;
  const nf = (b * e - a * f) * invDet;
  return [na, nb, nc, nd, ne, nf];
};

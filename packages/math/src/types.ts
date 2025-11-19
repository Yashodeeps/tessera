export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };

export type Mat2D = [number, number, number, number, number, number];
// layout: [a, b, c, d, e, f] like SVG/CSS transforms where matrix:
// [ a c e ]
// [ b d f ]
// [ 0 0 1 ]

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

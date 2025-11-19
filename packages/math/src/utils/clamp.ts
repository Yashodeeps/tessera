export function clamp(v: number, a: number, b: number): number {
    if (v < a) return a;
    if (v > b) return b;
    return v;
  }
  
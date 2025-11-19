# @tessera/math

Small, fast TypeScript math primitives for Tessera.

Includes:
- Vec2 helpers
- 2D transform matrix (Mat2D)
- Axis-aligned Rect helpers
- Small utils (approx, clamp)

## Usage
```ts
import { vec2, add, scale, identity, translate, applyToPoint } from "@tessera/math";

const p = vec2(1,2);
const q = add(p, vec2(3,4));

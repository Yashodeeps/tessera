import type { Scene } from "../types";



export interface Renderer {
  resize(w: number, h: number): void;
  render(scene: Scene): void;
}

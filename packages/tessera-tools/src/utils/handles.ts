import type { Vec2 } from "@tessera/math";

export type HandleType = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

export interface Handle {
  type: HandleType;
  position: Vec2;
}

export function getHandlesForShape(shape: any): Handle[] {
  if (!shape || typeof shape.width !== "number") return [];

  const pos = shape.position || { x: 0, y: 0 };
  const w = shape.width;
  const h = shape.height || shape.width;

  return [
    { type: "nw", position: { x: pos.x, y: pos.y } },
    { type: "ne", position: { x: pos.x + w, y: pos.y } },
    { type: "sw", position: { x: pos.x, y: pos.y + h } },
    { type: "se", position: { x: pos.x + w, y: pos.y + h } },
    { type: "n", position: { x: pos.x + w / 2, y: pos.y } },
    { type: "s", position: { x: pos.x + w / 2, y: pos.y + h } },
    { type: "e", position: { x: pos.x + w, y: pos.y + h / 2 } },
    { type: "w", position: { x: pos.x, y: pos.y + h / 2 } },
  ];
}

export function getCursorForHandle(handle: HandleType): string {
  switch (handle) {
    case "nw":
    case "se":
      return "nwse-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    default:
      return "default";
  }
}


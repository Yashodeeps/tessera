import type { Vec2 } from "@tessera/math";
import type { Rect, Circle, Polygon } from "@tessera/geometry";

/**
 * Shape types for rendering - these include transform properties
 * that are applied during rendering
 */

export interface RectShape {
  type: "rect";
  position: Vec2;
  width: number;
  height: number;
  rotation?: number;
  scale?: { x: number; y: number };
}

export interface CircleShape {
  type: "circle";
  position: Vec2;
  radius: number;
  rotation?: number;
  scale?: { x: number; y: number };
}

export interface EllipseShape {
  type: "ellipse";
  position: Vec2;
  rx: number;
  ry: number;
  rotation?: number;
  scale?: { x: number; y: number };
}

export interface PolygonShape {
  type: "polygon";
  points: Vec2[];
  rotation?: number;
  scale?: { x: number; y: number };
}

export interface PathShape {
  type: "path" | "polyline";
  points: Vec2[];
  rotation?: number;
  scale?: { x: number; y: number };
}

export type RenderShape = RectShape | CircleShape | EllipseShape | PolygonShape | PathShape;


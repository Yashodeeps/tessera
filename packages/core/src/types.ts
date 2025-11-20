import type { Vec2 } from "@tessera/math";
import type { AnyShape, Rect } from "@tessera/geometry";

export type NodeId = string;

export interface BaseNode {
  id: NodeId;
  type: "layer" | "group" | "shape";
  parent: NodeId | null;
  children: NodeId[]; // for layer/group: children; empty for shape
  transform?: {
    position: Vec2;
    rotation: number;
    scale: { x: number; y: number };
  };
  meta?: Record<string, unknown>;
}

export interface LayerNode extends BaseNode {
  type: "layer";
}

export interface GroupNode extends BaseNode {
  type: "group";
}

export interface ShapeNode extends BaseNode {
  type: "shape";
  shape: AnyShape;
}

export type SceneNode = LayerNode | GroupNode | ShapeNode;

export interface Scene {
  nodes: Record<NodeId, SceneNode>;
  rootLayers: NodeId[]; // ordered rendering order
}

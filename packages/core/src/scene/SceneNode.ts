import { Scene, NodeId, SceneNode, BaseNode } from "../types";
import { vec2 } from "@tessera/math";


export function createLayer(id: NodeId): SceneNode {
  return {
    id,
    type: "layer",
    parent: null,
    children: [],
    transform: { position: vec2(0, 0), rotation: 0, scale: { x: 1, y: 1 } },
    meta: {}
  };
}

export function createGroup(id: NodeId, parent: NodeId | null = null): SceneNode {
  return {
    id,
    type: "group",
    parent,
    children: [],
    transform: { position: vec2(0, 0), rotation: 0, scale: { x: 1, y: 1 } },
    meta: {}
  };
}

export function createShapeNode(id: NodeId, shape: any, parent: NodeId | null = null): SceneNode {
  return {
    id,
    type: "shape",
    parent,
    children: [],
    transform: { position: shape.position ?? vec2(0, 0), rotation: shape.rotation ?? 0, scale: shape.scale ?? { x: 1, y: 1 } },
    meta: {},
    // attach shape payload
    shape
  } as SceneNode;
}

export function addNode(scene: Scene, node: SceneNode): Scene {
  const nodes = { ...scene.nodes, [node.id]: node };
  const rootLayers = scene.rootLayers.slice();
  if (node.type === "layer" && !rootLayers.includes(node.id)) rootLayers.push(node.id);
  if (node.parent) {
    const p = nodes[node.parent];
    if (p) {
      const copy = { ...p, children: [...p.children, node.id] };
      nodes[node.parent] = copy;
    }
  }
  return { ...scene, nodes, rootLayers };
}

export function removeNode(scene: Scene, id: NodeId): Scene {
  const nodes = { ...scene.nodes };
  const toRemove = collectSubtree(nodes, id);
  for (const r of toRemove) delete nodes[r];
  for (const nid in nodes) {
    const node = nodes[nid];
    if (node && node.children.includes(id)) {
      nodes[nid] = { ...node, children: node.children.filter((c: NodeId) => c !== id) };
    }
  }
  return { ...scene, nodes, rootLayers: scene.rootLayers.filter(l => !toRemove.includes(l)) };
}

function collectSubtree(nodes: Record<NodeId, SceneNode>, id: NodeId): NodeId[] {
  const out: NodeId[] = [];
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    out.push(cur);
    const node = nodes[cur];
    if (!node) continue;
    for (const c of node.children) stack.push(c);
  }
  return out;
}

# @tessera/renderer-canvas2d

Canvas2D renderer for Tessera.

Features:
- Attach to an HTMLCanvasElement
- Viewport (pan/zoom)
- Basic draw routines for rect, ellipse, polygon, path
- Dirty marking API (markDirty, render)
- Simple integration with `@tessera/core` scene graph

## Usage

```ts
import { Canvas2DRenderer } from "@tessera/renderer-canvas2d";
import { Store } from "@tessera/core/state/Store";
import { createLayer, createShapeNode, addNode } from "@tessera/core/scene/SceneNode";

const renderer = new Canvas2DRenderer();
renderer.attach(document.querySelector("canvas"));
renderer.resize(800, 600);
renderer.setViewport({ x: 0, y: 0, zoom: 1 });

const scene = { nodes: {}, rootLayers: [] };
const layer = createLayer("L");
const scene1 = addNode(scene, layer);
const rect = { type: "rect", position: { x: 10, y: 10 }, width: 100, height: 60 };
const shapeNode = createShapeNode("S1", rect as any, "L");
const scene2 = addNode(scene1, shapeNode);

const store = new Store(scene2);
renderer.markDirty("S1");
renderer.render(store.getState().scene);
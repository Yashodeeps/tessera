# @tessera/tools

Tools system for Tessera — selection, move, resize, rotate, rect creation, and tool manager.

## Overview

This package provides a complete tools system for the Tessera graphics editor, including:

- **ToolManager**: Manages tool registration and activation
- **SelectionTool**: Click and marquee selection
- **MoveTool**: Drag to move selected shapes
- **ResizeTool**: Resize shapes with handles
- **RotateTool**: Rotate shapes around their center
- **RectTool**: Create rectangles by dragging
- **Commands**: Undo/redo support via Command pattern (MoveCommand, ResizeCommand, CreateShapeCommand)

## Quickstart

1. Import ToolManager and register tools
2. Wire EventManager pointer callbacks into ToolManager.handlePointerX
3. Use History for undo/redo and Store for state

See `src/demo/editorDemo.ts` for a complete wiring example.

## Architecture

**EventManager** (from @tessera/core) receives pointer events and uses geometry hit-tests to find top-most shape. It calls your wiring functions (we used `em.onPointerDown` etc). In the demo, we both set selection on click and forward the pointer event to ToolManager.

**ToolManager** holds the active tool and routes pointer events into it. Tools operate on Store (scene/state) and may call `History.execute()` to push Commands.

**MoveTool/ResizeTool** mutate the scene directly while dragging (for immediate visual feedback) and create Command objects on pointer up so undo/redo can restore previous state.

**SelectionTool** handles click and marquee selection. We used a simple approach for marquee; refine later by using geometry bbox ops.

**RectTool** creates shapes and pushes CreateShapeCommand to history so creation can be undone.

**Renderer** is notified via `markDirty()` and `render(scene)`; you should mark changed nodes as dirty in tools after they mutate shapes.

## Example Usage

```typescript
import { ToolManager, SelectionTool, MoveTool } from "@tessera/tools";
import { Store, History } from "@tessera/core";
import { EventManager } from "@tessera/core";

const store = new Store(initialScene);
const history = new History();
const em = new EventManager(store);

const tm = new ToolManager(store);
tm.register(new SelectionTool(store));
tm.register(new MoveTool(store, history));

// Wire EventManager to ToolManager
em.onPointerDown((p) => {
  if (p.nodeId) {
    store.setSelection([p.nodeId]);
  }
  tm.handlePointerDown({ point: p.point, original: p.original });
});
```

## API

### ToolManager

- `register(tool: Tool)`: Register a tool
- `activate(id: string)`: Activate a tool by ID
- `getActive()`: Get currently active tool
- `handlePointerDown/Move/Up(e: PointerEvent)`: Route events to active tool

### Tools

All tools implement the `Tool` interface and receive `PointerEvent` objects with world coordinates.

### Commands

Commands implement the `Command` interface with `do()` and `undo()` methods for history support.


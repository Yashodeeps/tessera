import { Store } from "@tessera/core";
import { createLayer, addNode, createShapeNode } from "@tessera/core";
import { Canvas2DRenderer } from "@tessera/renderer-canvas2d";
import { EventManager } from "@tessera/core";
import { History } from "@tessera/core";
import { ToolManager } from "../tools/ToolManager";
import { SelectionTool } from "../tools/SelectionTool";
import { MoveTool } from "../tools/MoveTool";
import { ResizeTool } from "../tools/ResizeTool";
import { RectTool } from "../tools/RectTool";
import { vec2 } from "@tessera/math";
import { screenToWorld } from "@tessera/renderer-canvas2d";

export function setupEditor(canvas: HTMLCanvasElement) {
  const scene = { nodes: {}, rootLayers: [] };
  const layer = createLayer("layer1");
  const scene1 = addNode(scene, layer);

  const rectShape = {
    id: "rect1",
    type: "rect",
    position: vec2(20, 20),
    width: 120,
    height: 80,
    rotation: 0,
    scale: { x: 1, y: 1 },
  };
  const rectNode = createShapeNode("s_rect1", rectShape as any, "layer1");
  const scene2 = addNode(scene1, rectNode);

  const store = new Store(scene2);
  const history = new History();

  const renderer = new Canvas2DRenderer();
  renderer.attach(canvas);
  renderer.setViewport({ x: 0, y: 0, zoom: 1 });
  renderer.render(store.getState().scene);

  // Subscribe to store changes for automatic redraw
  const unsubscribeStore = store.subscribe((state) => {
    renderer.setViewport(state.viewport);
    renderer.setSelection(state.selection);
    renderer.setActiveTool(state.activeTool);
    // Extract preview rect and marquee from meta if they exist
    const meta = (state as any).meta;
    const previewRect = meta?.previewRect || null;
    const marquee = meta?.marquee || null;
    renderer.setPreviewRect(previewRect);
    renderer.setMarquee(marquee);
    renderer.render(state.scene);
  });

  const em = new EventManager(store);

  // Track active pointer IDs for drag operations
  const activePointers = new Set<number>();

  // Convert screen coordinates to world coordinates using viewport
  const handlePointerEvent = (ev: PointerEvent, handler: (point: { x: number; y: number }, original: any) => void) => {
    const rect = canvas.getBoundingClientRect();
    const screenX = ev.clientX - rect.left;
    const screenY = ev.clientY - rect.top;
    
    const viewport = store.getState().viewport;
    const worldPoint = screenToWorld(viewport, canvas.clientWidth, canvas.clientHeight, { x: screenX, y: screenY });
    
    handler(worldPoint, ev);
  };

  // Pointer move handler that's only active during drag
  const handleDragMove = (ev: PointerEvent) => {
    if (!activePointers.has(ev.pointerId)) return;
    
    handlePointerEvent(ev, (point, original) => {
      em.pointerMove(point, original);
      // Trigger redraw during drag for responsive UI
      renderer.markDirty("scene");
    });
  };

  // Canvas event handlers
  const handlePointerDown = (ev: PointerEvent) => {
    ev.preventDefault();
    canvas.setPointerCapture(ev.pointerId);
    activePointers.add(ev.pointerId);
    
    handlePointerEvent(ev, (point, original) => {
      em.pointerDown(point, original);
    });

    // Set up pointermove handler for this drag operation
    canvas.addEventListener("pointermove", handleDragMove);
  };

  const handlePointerUp = (ev: PointerEvent) => {
    canvas.releasePointerCapture(ev.pointerId);
    activePointers.delete(ev.pointerId);
    
    // Remove drag move handler when pointer is released
    canvas.removeEventListener("pointermove", handleDragMove);
    
    handlePointerEvent(ev, (point, original) => {
      em.pointerUp(point, original);
    });
  };

  const handlePointerCancel = (ev: PointerEvent) => {
    canvas.releasePointerCapture(ev.pointerId);
    activePointers.delete(ev.pointerId);
    
    // Remove drag move handler when pointer is cancelled
    canvas.removeEventListener("pointermove", handleDragMove);
    
    handlePointerEvent(ev, (point, original) => {
      em.pointerUp(point, original);
    });
  };

  // Add canvas event listeners
  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointercancel", handlePointerCancel);

  // Handle canvas resize
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === canvas) {
        const { width, height } = entry.contentRect;
        renderer.resize(width, height);
      }
    }
  });
  resizeObserver.observe(canvas);

  // Initial resize
  renderer.resize(canvas.clientWidth, canvas.clientHeight);

  const tm = new ToolManager(store);
  const sel = new SelectionTool(store);
  const mv = new MoveTool(store, history);
  const rs = new ResizeTool(store, history);
  const rectTool = new RectTool(store, history);

  tm.register(sel);
  tm.register(mv);
  tm.register(rs);
  tm.register(rectTool);

  // Set default tool
  tm.activate("select");

  // EventManager listeners - store cleanup functions
  const cleanupListeners: (() => void)[] = [];

  const cleanupPointerDown = em.onPointerDown((p) => {
    const activeTool = store.getState().activeTool;
    const currentSelection = store.getState().selection;
    
    // For resize tool, let it check for handles first before changing selection
    if (activeTool === "resize" && currentSelection.length > 0) {
      // Check if clicking on a handle by letting ResizeTool process first
      // We need to check if a handle was hit, but we can't know that until after
      // So we'll handle selection after the tool processes, but preserve selection
      // if clicking on empty space (might be clicking on a handle)
      
      // If clicking on a different shape, select it
      if (p.nodeId && !currentSelection.includes(p.nodeId)) {
        store.setSelection([p.nodeId]);
      }
      // If clicking on empty space, keep current selection (might be clicking on handle)
      // The ResizeTool will handle starting the drag if a handle is hit
      
      tm.handlePointerDown({
        point: p.point,
        original: p.original,
        shiftKey: p.original?.shiftKey,
      });
      return;
    }
    
    // For move tool, preserve selection when clicking on selected shape or empty space
    if (activeTool === "move" && currentSelection.length > 0) {
      // If clicking on a different shape, select it
      if (p.nodeId && !currentSelection.includes(p.nodeId)) {
        store.setSelection([p.nodeId]);
      }
      // If clicking on selected shape or empty space, keep current selection
      // The MoveTool will handle starting the drag
      
      tm.handlePointerDown({
        point: p.point,
        original: p.original,
        shiftKey: p.original?.shiftKey,
      });
      return;
    }
    
    // For other tools, handle selection normally
    if (p.nodeId) {
      store.setSelection([p.nodeId]);
    } else {
      store.setSelection([]);
    }

    tm.handlePointerDown({
      point: p.point,
      original: p.original,
      shiftKey: p.original?.shiftKey,
    });
  });
  cleanupListeners.push(cleanupPointerDown);

  // Pointer move handler - only active during drag (set up in pointerdown)
  const cleanupPointerMove = em.onPointerMove((p) => {
    tm.handlePointerMove({
      point: p.point,
      original: p.original,
      shiftKey: p.original?.shiftKey,
    });
    // Redraw is already triggered in handleDragMove, but ensure it happens
    renderer.markDirty("scene");
  });
  cleanupListeners.push(cleanupPointerMove);

  const cleanupPointerUp = em.onPointerUp((p) => {
    tm.handlePointerUp({
      point: p.point,
      original: p.original,
      shiftKey: p.original?.shiftKey,
    });
  });
  cleanupListeners.push(cleanupPointerUp);

  // Cleanup function
  const cleanup = () => {
    // Remove canvas event listeners
    canvas.removeEventListener("pointerdown", handlePointerDown);
    canvas.removeEventListener("pointermove", handleDragMove);
    canvas.removeEventListener("pointerup", handlePointerUp);
    canvas.removeEventListener("pointercancel", handlePointerCancel);
    
    // Clear active pointers
    activePointers.clear();
    
    // Disconnect resize observer
    resizeObserver.disconnect();
    
    // Unsubscribe from store
    unsubscribeStore();
    
    // Cleanup EventManager listeners
    cleanupListeners.forEach(fn => fn());
  };

  return {
    store,
    history,
    renderer,
    cleanup,
    activateTool: (toolId: string) => tm.activate(toolId),
    undo: () => {
      if (history.canUndo()) {
        history.undo();
        // Force redraw after undo
        renderer.render(store.getState().scene);
      }
    },
    redo: () => {
      if (history.canRedo()) {
        history.redo();
        // Force redraw after redo
        renderer.render(store.getState().scene);
      }
    },
    canUndo: () => history.canUndo(),
    canRedo: () => history.canRedo(),
    deleteSelected: () => {
      const selection = store.getState().selection;
      if (selection.length === 0) return;
      // Simple delete for now - can be enhanced with DeleteCommand
      store.setSelection([]);
    },
  };
}


import Tool, { PointerEvent } from "./Tool";
import type { Store } from "@tessera/core";


export class ToolManager {
  private store: Store;
  private tools: Record<string, Tool> = {};
  private active: Tool | null = null;

  constructor(store: Store) {
    this.store = store;
  }

  register(tool: Tool) {
    this.tools[tool.id] = tool;
  }

  activate(id: string) {
    if (this.active?.id === id) return;
    this.active?.onDeactivate?.();

    const t = this.tools[id];
    if (!t) throw new Error(`Tool ${id} not registered`);

    this.active = t;
    this.active.onActivate?.();
    this.store.setActiveTool(id);
  }

  getActive() {
    return this.active;
  }

  handlePointerDown(e: PointerEvent) {
    this.active?.onPointerDown?.(e);
  }

  handlePointerMove(e: PointerEvent) {
    this.active?.onPointerMove?.(e);
  }

  handlePointerUp(e: PointerEvent) {
    this.active?.onPointerUp?.(e);
  }
}


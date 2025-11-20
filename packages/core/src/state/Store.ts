import type { Scene } from "../types";


type Listener<T> = (t: T) => void;

export interface CoreState {
  scene: Scene;
  selection: string[]; 
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  activeTool: string | null;
}

export class Store {
  private state: CoreState;
  private listeners: Listener<CoreState>[] = [];

  constructor(initialScene: Scene) {
    this.state = {
      scene: initialScene,
      selection: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      activeTool: null
    };
  }

  getState(): CoreState {
    return this.state;
  }

  subscribe(l: Listener<CoreState>) {
    this.listeners.push(l);
    // return unsubscribe
    return () => {
      this.listeners = this.listeners.filter(x => x !== l);
    };
  }

  private emit() {
    for (const l of this.listeners) l(this.state);
  }

  update(fn: (s: CoreState) => CoreState) {
    this.state = fn(this.state);
    this.emit();
  }

  setSelection(ids: string[]) {
    this.update(s => ({ ...s, selection: ids }));
  }

  setViewport(v: { x: number; y: number; zoom: number }) {
    this.update(s => ({ ...s, viewport: v }));
  }

  setActiveTool(tool: string | null) {
    this.update(s => ({ ...s, activeTool: tool }));
  }

  replaceScene(scene: Scene) {
    this.update(s => ({ ...s, scene }));
  }
}

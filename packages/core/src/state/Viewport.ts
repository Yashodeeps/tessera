import type { Store } from "./Store";

export function pan(store: Store, dx: number, dy: number) {
  const s = store.getState();
  store.setViewport({ ...s.viewport, x: s.viewport.x + dx, y: s.viewport.y + dy });
}

export function zoomAt(store: Store, factor: number, cx: number, cy: number) {
  const s = store.getState();
  const next = s.viewport.zoom * factor;
  store.setViewport({ ...s.viewport, zoom: next });
}
    
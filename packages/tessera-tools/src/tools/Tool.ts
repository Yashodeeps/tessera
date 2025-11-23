import type { Vec2 } from "@tessera/math";
import type { Store } from "@tessera/core";


export type PointerEvent = {
  point: Vec2;     
  original?: any;  
  button?: number; 
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
};

export default interface Tool {
  id: string;
  store: Store;
  onPointerDown?(e: PointerEvent): void;
  onPointerMove?(e: PointerEvent): void;
  onPointerUp?(e: PointerEvent): void;
  onActivate?(): void;
  onDeactivate?(): void;
}


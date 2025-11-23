import Command from "./Command";

export class ResizeCommand implements Command {
  private shapeRef: any;
  private prev: { width: number; height: number };
  private next: { width: number; height: number };

  constructor(
    shapeRef: any,
    prev: { width: number; height: number },
    next: { width: number; height: number }
  ) {
    this.shapeRef = shapeRef;
    this.prev = prev;
    this.next = next;
  }

  do() {
    this.shapeRef.width = this.next.width;
    this.shapeRef.height = this.next.height;
  }

  undo() {
    this.shapeRef.width = this.prev.width;
    this.shapeRef.height = this.prev.height;
  }
}



export interface Command {
    id?: string;
    do(): void;
    undo(): void;
  }
  
  export class History {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];
    private max = 200;
  
    execute(cmd: Command) {
      cmd.do();
      this.undoStack.push(cmd);
      this.redoStack = [];
      if (this.undoStack.length > this.max) this.undoStack.shift();
    }
  
    canUndo() {
      return this.undoStack.length > 0;
    }
  
    canRedo() {
      return this.redoStack.length > 0;
    }
  
    undo() {
      const cmd = this.undoStack.pop();
      if (!cmd) return;
      cmd.undo();
      this.redoStack.push(cmd);
    }
  
    redo() {
      const cmd = this.redoStack.pop();
      if (!cmd) return;
      cmd.do();
      this.undoStack.push(cmd);
    }
  
    clear() {
      this.undoStack = [];
      this.redoStack = [];
    }
  }
  
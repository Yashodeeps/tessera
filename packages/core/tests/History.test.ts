import { describe, it, expect, beforeEach } from "vitest";
import { History, type Command } from "../src/state/History";

describe("History", () => {
  let history: History;
  let counter: number;

  beforeEach(() => {
    history = new History();
    counter = 0;
  });

  describe("execute", () => {
    it("should execute a command", () => {
      const command: Command = {
        do: () => {
          counter++;
        },
        undo: () => {
          counter--;
        },
      };

      history.execute(command);
      expect(counter).toBe(1);
    });

    it("should clear redo stack when executing new command", () => {
      const command1: Command = {
        do: () => counter++,
        undo: () => counter--,
      };
      const command2: Command = {
        do: () => counter++,
        undo: () => counter--,
      };

      history.execute(command1);
      history.execute(command2);
      history.undo();
      expect(history.canRedo()).toBe(true);

      const command3: Command = {
        do: () => counter++,
        undo: () => counter--,
      };
      history.execute(command3);
      expect(history.canRedo()).toBe(false);
    });
  });

  describe("canUndo", () => {
    it("should return false when no commands executed", () => {
      expect(history.canUndo()).toBe(false);
    });

    it("should return true when commands exist", () => {
      const command: Command = {
        do: () => counter++,
        undo: () => counter--,
      };
      history.execute(command);
      expect(history.canUndo()).toBe(true);
    });
  });

  describe("canRedo", () => {
    it("should return false when no commands undone", () => {
      expect(history.canRedo()).toBe(false);
    });

    it("should return true after undo", () => {
      const command: Command = {
        do: () => counter++,
        undo: () => counter--,
      };
      history.execute(command);
      history.undo();
      expect(history.canRedo()).toBe(true);
    });
  });

  describe("undo", () => {
    it("should undo the last command", () => {
      const command: Command = {
        do: () => counter++,
        undo: () => counter--,
      };

      history.execute(command);
      expect(counter).toBe(1);

      history.undo();
      expect(counter).toBe(0);
    });

    it("should do nothing if no commands to undo", () => {
      history.undo();
      expect(counter).toBe(0);
    });

    it("should undo multiple commands in reverse order", () => {
      const command1: Command = {
        do: () => counter++,
        undo: () => counter--,
      };
      const command2: Command = {
        do: () => counter++,
        undo: () => counter--,
      };

      history.execute(command1);
      history.execute(command2);
      expect(counter).toBe(2);

      history.undo();
      expect(counter).toBe(1);

      history.undo();
      expect(counter).toBe(0);
    });
  });

  describe("redo", () => {
    it("should redo the last undone command", () => {
      const command: Command = {
        do: () => counter++,
        undo: () => counter--,
      };

      history.execute(command);
      history.undo();
      expect(counter).toBe(0);

      history.redo();
      expect(counter).toBe(1);
    });

    it("should do nothing if no commands to redo", () => {
      history.redo();
      expect(counter).toBe(0);
    });

    it("should redo multiple commands in order", () => {
      const command1: Command = {
        do: () => counter++,
        undo: () => counter--,
      };
      const command2: Command = {
        do: () => counter++,
        undo: () => counter--,
      };

      history.execute(command1);
      history.execute(command2);
      history.undo();
      history.undo();
      expect(counter).toBe(0);

      history.redo();
      expect(counter).toBe(1);

      history.redo();
      expect(counter).toBe(2);
    });
  });

  describe("clear", () => {
    it("should clear all history", () => {
      const command: Command = {
        do: () => counter++,
        undo: () => counter--,
      };

      history.execute(command);
      history.undo();
      expect(history.canUndo()).toBe(false);
      expect(history.canRedo()).toBe(true);

      history.clear();
      expect(history.canUndo()).toBe(false);
      expect(history.canRedo()).toBe(false);
    });
  });

  describe("max stack size", () => {
    it("should limit undo stack size", () => {
      const max = 200;
      // Create more commands than max
      for (let i = 0; i < max + 10; i++) {
        const command: Command = {
          do: () => counter++,
          undo: () => counter--,
        };
        history.execute(command);
      }

      // Should still be able to undo max times
      let undoCount = 0;
      while (history.canUndo()) {
        history.undo();
        undoCount++;
      }

      expect(undoCount).toBe(max);
    });
  });
});


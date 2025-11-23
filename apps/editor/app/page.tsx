"use client";

import { useEffect, useRef, useState } from "react";
import { setupEditor } from "@tessera/tools";
import styles from "./page.module.css";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editorApi, setEditorApi] = useState<{
    activateTool: (toolId: string) => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    deleteSelected: () => void;
    cleanup?: () => void;
  } | null>(null);
  const [activeTool, setActiveTool] = useState("select");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const api = setupEditor(canvasRef.current);
    setEditorApi(api);

    // Update undo/redo state periodically
    const interval = setInterval(() => {
      setCanUndo(api.canUndo());
      setCanRedo(api.canRedo());
    }, 100);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        api.deleteSelected();
      } else if (e.key === "Escape") {
        api.activateTool("select");
        setActiveTool("select");
      } else if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        api.undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        api.redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      // Cleanup editor resources
      if (api.cleanup) {
        api.cleanup();
      }
    };
  }, []);

  const handleToolClick = (toolId: string) => {
    if (editorApi) {
      editorApi.activateTool(toolId);
      setActiveTool(toolId);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <button
            className={`${styles.toolButton} ${activeTool === "select" ? styles.active : ""}`}
            onClick={() => handleToolClick("select")}
            title="Select Tool (V)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3L10 10M10 10L17 3M10 10L10 17" stroke="currentColor" strokeWidth="2" />
            </svg>
            Select
          </button>
          <button
            className={`${styles.toolButton} ${activeTool === "move" ? styles.active : ""}`}
            onClick={() => handleToolClick("move")}
            title="Move Tool (M)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L10 18M2 10L18 10" stroke="currentColor" strokeWidth="2" />
            </svg>
            Move
          </button>
          <button
            className={`${styles.toolButton} ${activeTool === "resize" ? styles.active : ""}`}
            onClick={() => handleToolClick("resize")}
            title="Resize Tool (R)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="2" />
            </svg>
            Resize
          </button>
          <button
            className={`${styles.toolButton} ${activeTool === "rect" ? styles.active : ""}`}
            onClick={() => handleToolClick("rect")}
            title="Rectangle Tool (R)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="2" />
            </svg>
            Rectangle
          </button>
        </div>
        <div className={styles.toolGroup}>
          <button
            className={styles.toolButton}
            onClick={() => editorApi?.undo()}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            className={styles.toolButton}
            onClick={() => editorApi?.redo()}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>
      </div>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          id="tessera"
          className={styles.canvas}
          style={{ cursor: getCursorForTool(activeTool) }}
        />
      </div>
    </div>
  );
}

function getCursorForTool(toolId: string): string {
  switch (toolId) {
    case "select":
      return "default";
    case "move":
      return "move";
    case "resize":
      return "nwse-resize";
    case "rect":
      return "crosshair";
    default:
      return "default";
  }
}

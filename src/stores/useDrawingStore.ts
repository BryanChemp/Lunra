import { create } from "zustand"
import type { Tool } from "../types/ToolsTypes";
import type { Brush } from "../types/BrushTypes";

type DrawingState = {
  brush: Brush
  tool: Tool
  activeLayer: number
  setBrush: (brush: Partial<DrawingState["brush"]>) => void
  setTool: (tool: Tool) => void
  setLayer: (layer: number) => void
}

const defaultBrush: Brush = {
  size: 10,
  color: "#1b1b1bff",
  opacity: 1,
  shape: "circle",
  spacing: 1
};

export const useDrawingStore = create<DrawingState>((set) => ({
  brush: defaultBrush,
  tool: "brush",
  activeLayer: 0,
  setBrush: (brush) => set((state) => ({ brush: { ...state.brush, ...brush } })),
  setTool: (tool) => set({ tool }),
  setLayer: (layer) => set({ activeLayer: layer })
}))

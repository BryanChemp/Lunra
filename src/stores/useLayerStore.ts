import { create } from "zustand"

export interface Layer {
  id: string
  name: string
  visible: boolean
  zIndex: number
}

interface LayerState {
  layers: Layer[]
  selectedLayerId: string | null
  addLayer: (name?: string) => void
  removeLayer: (id: string) => void
  toggleVisibility: (id: string) => void
  selectLayer: (id: string) => void
  reorderLayer: (id: string, newIndex: number) => void
}

export const useLayerStore = create<LayerState>((set, get) => ({
  layers: [],
  selectedLayerId: "1",

  addLayer: (name = `Camada ${get().layers.length + 1}`) => {
    const newLayer: Layer = {
      id: crypto.randomUUID(),
      name,
      visible: true,
      zIndex: get().layers.length,
    }
    set(state => ({ layers: [...state.layers, newLayer], selectedLayerId: newLayer.id }))
  },

  removeLayer: (id) => {
    set(state => ({
      layers: state.layers.filter(l => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId
    }))
  },

  toggleVisibility: (id) => {
    set(state => ({
      layers: state.layers.map(l =>
        l.id === id ? { ...l, visible: !l.visible } : l
      )
    }))
  },

  selectLayer: (id) => set({ selectedLayerId: id }),

  reorderLayer: (id, newIndex) => {
    const layers = [...get().layers]
    const index = layers.findIndex(l => l.id === id)
    if (index === -1) return

    const [removed] = layers.splice(index, 1)
    layers.splice(newIndex, 0, removed)

    const reordered = layers.map((l, i) => ({ ...l, zIndex: i }))
    set({ layers: reordered })
  },
}))

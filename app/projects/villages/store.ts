import { create } from "zustand"
import { Village, villages as initialVillages } from "@/data/villages"

interface VillagesState {
  villages: Village[]
  setVillages: (villages: Village[]) => void
  updateVillage: (id: string, name: string, state: string) => void
  deleteVillage: (id: string) => void
}

export const useVillagesStore = create<VillagesState>((set) => ({
  villages: initialVillages,
  setVillages: (villages) => set({ villages }),
  updateVillage: (id, name, state) =>
    set((storeState) => ({
      villages: storeState.villages.map((item) =>
        item.id === id
          ? {
              ...item,
              name,
              state,
              updated_at: new Date().toISOString().replace("T", " ").substring(0, 26),
            }
          : item
      ),
    })),
  deleteVillage: (id) =>
    set((storeState) => ({
      villages: storeState.villages.filter((item) => item.id !== id),
    })),
}))

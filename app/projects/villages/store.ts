"use client"

import * as React from "react"
import { create } from "zustand"
import { Village } from "@/data/villages"

interface VillagesState {
  villages: Village[]
  isLoading: boolean
  setVillages: (villages: Village[]) => void
  setIsLoading: (isLoading: boolean) => void
  updateVillage: (id: string, name: string, state: string) => void
  deleteVillage: (id: string) => void
}

export const useVillagesStore = create<VillagesState>((set) => ({
  villages: [],
  isLoading: true,
  setVillages: (villages) => set({ villages }),
  setIsLoading: (isLoading) => set({ isLoading }),
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

interface StoreInitializerProps {
  initialVillages: Village[]
}

export function VillagesStoreInitializer({ initialVillages }: StoreInitializerProps) {
  React.useState(() => {
    useVillagesStore.setState({ villages: initialVillages, isLoading: true })
  })

  React.useEffect(() => {
    const timer = setTimeout(() => {
      useVillagesStore.setState({ isLoading: false })
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return null
}

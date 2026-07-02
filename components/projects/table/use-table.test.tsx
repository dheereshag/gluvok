import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useProjectTable } from "./use-table"
import { fetchEntityListPaginated } from "@/lib/services"

const mockTriggerEntitiesUpdate = vi.fn()

interface MockAuthStoreState {
  user: {
    role: string
    profile: { id: number; preferences: Record<string, string[]> }
  }
}

interface MockEntitiesStoreState {
  entitiesUpdatedTrigger: number
  updateColumnPreferences: () => void
  triggerEntitiesUpdate: () => void
}

// Mock dependencies
vi.mock("@/lib/store", () => {
  const mockAuthStore = {
    getState: () => ({
      user: {
        role: "admin",
        profile: { id: 1, preferences: {} },
      },
    }),
    subscribe: () => () => {},
  }

  const mockEntitiesStore = {
    getState: () => ({
      entitiesUpdatedTrigger: 0,
      updateColumnPreferences: () => {},
      triggerEntitiesUpdate: mockTriggerEntitiesUpdate,
    }),
    subscribe: () => () => {},
  }

  const useAuthStoreMock = Object.assign(
    (selector: (state: MockAuthStoreState) => unknown) => selector(mockAuthStore.getState()),
    mockAuthStore
  )

  const useEntitiesStoreMock = Object.assign(
    (selector: (state: MockEntitiesStoreState) => unknown) => selector(mockEntitiesStore.getState()),
    mockEntitiesStore
  )

  return {
    useAuthStore: useAuthStoreMock,
    useEntitiesStore: useEntitiesStoreMock,
    getPermissions: () => ({
      read: true,
      write: true,
      delete: true,
      create: true,
      show: true,
    }),
  }
})

vi.mock("@/lib/services", () => ({
  fetchEntityListPaginated: vi.fn().mockResolvedValue({ data: [], count: 0 }),
}))

vi.mock("@/components/projects/columns", () => ({
  getProjectColumns: vi.fn().mockReturnValue([]),
}))

describe("useProjectTable Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should initialize default states correctly and load data", async () => {
    vi.mocked(fetchEntityListPaginated).mockResolvedValue({
      data: [{ id: 1, name: "Item 1", created_at: "", updated_at: "" }],
      count: 1,
    })

    const { result } = renderHook(() =>
      useProjectTable({
        projectSlug: "centers",
        primaryIdKey: "id",
        projectName: "Centers",
      })
    )

    // Advance timer to trigger the debounced search (300ms)
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Verify loading completes
    expect(result.current.isLoading).toBe(false)
    expect(result.current.creating).toBe(false)
    expect(result.current.editingItem).toBeNull()
    expect(result.current.deletingItem).toBeNull()

    expect(fetchEntityListPaginated).toHaveBeenCalledWith("centers", {
      page: 0,
      pageSize: 10,
      sortColumn: undefined,
      sortDesc: undefined,
      search: "",
    })
  })

  it("should debounce search input changes", async () => {
    vi.mocked(fetchEntityListPaginated).mockResolvedValue({ data: [], count: 0 })

    const { result } = renderHook(() =>
      useProjectTable({
        projectSlug: "centers",
        primaryIdKey: "id",
        projectName: "Centers",
      })
    )

    // Initial load
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(fetchEntityListPaginated).toHaveBeenCalledTimes(1)

    // Set global search filter
    act(() => {
      result.current.table.setGlobalFilter("search-term")
    })

    // Immediate check - should not fire fetch yet due to 300ms debounce
    expect(fetchEntityListPaginated).toHaveBeenCalledTimes(1)

    // Advance timer to trigger debounced filter
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(fetchEntityListPaginated).toHaveBeenCalledTimes(2)
    expect(fetchEntityListPaginated).toHaveBeenLastCalledWith("centers", expect.objectContaining({
      search: "search-term",
    }))
  })

  it("should handle reload and reset search/sorting", async () => {
    const { result } = renderHook(() =>
      useProjectTable({
        projectSlug: "centers",
        primaryIdKey: "id",
        projectName: "Centers",
      })
    )

    await act(async () => {
      result.current.handleReload()
    })

    expect(mockTriggerEntitiesUpdate).toHaveBeenCalled()
  })
})

import { type Assignment } from "@/types"

export const assignments: Assignment[] = [
  // Super Admin 1 (da11@iitbbs.ac.in) -> assigned to all factories
  { id: 1, factory_id: 1, user_id: "6025181a-91b2-4e5f-b8d3-7c5d37867f15", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },
  { id: 2, factory_id: 2, user_id: "6025181a-91b2-4e5f-b8d3-7c5d37867f15", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },
  { id: 3, factory_id: 3, user_id: "6025181a-91b2-4e5f-b8d3-7c5d37867f15", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },

  // Super Admin 2 (super2@example.com) -> assigned to all factories
  { id: 4, factory_id: 1, user_id: "f1a8e8b8-2b8d-4e9e-b5c6-7a8b9c0d1e2f", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },
  { id: 5, factory_id: 2, user_id: "f1a8e8b8-2b8d-4e9e-b5c6-7a8b9c0d1e2f", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },
  { id: 6, factory_id: 3, user_id: "f1a8e8b8-2b8d-4e9e-b5c6-7a8b9c0d1e2f", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },

  // Factory 1 Users (Punjab Grain Depot)
  { id: 7, factory_id: 1, user_id: "056c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // amit (Admin)
  { id: 8, factory_id: 1, user_id: "156c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin1b (Admin)
  { id: 9, factory_id: 1, user_id: "1a6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager1a (Manager)
  { id: 10, factory_id: 1, user_id: "1b6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager1b (Manager)
  { id: 11, factory_id: 1, user_id: "356c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // neha (Operator)
  { id: 12, factory_id: 1, user_id: "1d6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator1b (Operator)
  { id: 13, factory_id: 1, user_id: "456c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // priya (Base)
  { id: 14, factory_id: 1, user_id: "1f6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base1b (Base)

  // Factory 2 Users (Amritsar Storage Yard)
  { id: 15, factory_id: 2, user_id: "2a6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin2a
  { id: 16, factory_id: 2, user_id: "2b6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin2b
  { id: 17, factory_id: 2, user_id: "2c6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager2a
  { id: 18, factory_id: 2, user_id: "2d6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager2b
  { id: 19, factory_id: 2, user_id: "2e6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator2a
  { id: 20, factory_id: 2, user_id: "2f6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator2b
  { id: 21, factory_id: 2, user_id: "206c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base2a
  { id: 22, factory_id: 2, user_id: "216c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base2b

  // Factory 3 Users (Jaipur Commodity Hub)
  { id: 23, factory_id: 3, user_id: "256c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // rahul (Admin)
  { id: 24, factory_id: 3, user_id: "3b6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin3b
  { id: 25, factory_id: 3, user_id: "3c6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager3a
  { id: 26, factory_id: 3, user_id: "3d6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager3b
  { id: 27, factory_id: 3, user_id: "3e6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator3a
  { id: 28, factory_id: 3, user_id: "3f6c8f39-b406-4f2d-bca2-304b5645b342", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator3b
  { id: 29, factory_id: 3, user_id: "306c8f39-b406-4f2d-bca2-304b5645b343", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base3a
  { id: 30, factory_id: 3, user_id: "316c8f39-b406-4f2d-bca2-304b5645b343", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base3b
]

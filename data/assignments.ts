import { type Assignment } from "@/types"

export const assignments: Assignment[] = [
  // Super Admin (super@example.com) -> assigned to all factories
  { id: 1, factory_id: 1, profile_id: "900000000002", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },
  { id: 2, factory_id: 2, profile_id: "900000000002", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },
  { id: 3, factory_id: 3, profile_id: "900000000002", created_at: "2026-06-07 11:46:03", updated_at: "2026-06-07 11:46:03" },

  // Factory 1 Users (Punjab Grain Depot)
  { id: 4, factory_id: 1, profile_id: "123456789012", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin1a
  { id: 5, factory_id: 1, profile_id: "100000000002", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin1b
  { id: 6, factory_id: 1, profile_id: "100000000003", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager1a
  { id: 7, factory_id: 1, profile_id: "100000000004", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager1b
  { id: 8, factory_id: 1, profile_id: "345678901234", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator1a
  { id: 9, factory_id: 1, profile_id: "456789012345", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator1b
  { id: 10, factory_id: 1, profile_id: "100000000007", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base1a
  { id: 11, factory_id: 1, profile_id: "100000000008", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base1b

  // Factory 2 Users (Amritsar Storage Yard)
  { id: 12, factory_id: 2, profile_id: "200000000001", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin2a
  { id: 13, factory_id: 2, profile_id: "200000000002", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin2b
  { id: 14, factory_id: 2, profile_id: "200000000003", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager2a
  { id: 15, factory_id: 2, profile_id: "200000000004", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager2b
  { id: 16, factory_id: 2, profile_id: "200000000005", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator2a
  { id: 17, factory_id: 2, profile_id: "200000000006", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator2b
  { id: 18, factory_id: 2, profile_id: "200000000007", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base2a
  { id: 19, factory_id: 2, profile_id: "200000000008", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base2b

  // Factory 3 Users (Jaipur Commodity Hub)
  { id: 20, factory_id: 3, profile_id: "234567890123", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin3a
  { id: 21, factory_id: 3, profile_id: "300000000002", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // admin3b
  { id: 22, factory_id: 3, profile_id: "300000000003", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager3a
  { id: 23, factory_id: 3, profile_id: "300000000004", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // manager3b
  { id: 24, factory_id: 3, profile_id: "300000000005", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator3a
  { id: 25, factory_id: 3, profile_id: "300000000006", created_at: "2026-06-07 11:50:14", updated_at: "2026-06-07 11:50:14" }, // operator3b
  { id: 26, factory_id: 3, profile_id: "300000000007", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base3a
  { id: 27, factory_id: 3, profile_id: "300000000008", created_at: "2026-06-07 11:52:00", updated_at: "2026-06-07 11:52:00" }, // base3b
]

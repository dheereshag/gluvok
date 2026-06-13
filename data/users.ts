import { type User } from "@/types";
import { Role } from "@/lib/constants";

export const users: User[] = [
  {
    id: "6025181a-91b2-4e5f-b8d3-7c5d37867f15",
    email: "da11@iitbbs.ac.in",
    role: Role.SUPER_ADMIN,
    created_at: "2026-06-07 11:46:03.686287+00",
    updated_at: "2026-06-07 11:46:03.705674+00",
  },
  {
    id: "056c8f39-b406-4f2d-bca2-304b5645b342",
    email: "amit@example.com",
    role: Role.ADMIN,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "256c8f39-b406-4f2d-bca2-304b5645b342",
    email: "rahul@example.com",
    role: Role.MANAGER,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "356c8f39-b406-4f2d-bca2-304b5645b342",
    email: "neha@example.com",
    role: Role.OPERATOR,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "456c8f39-b406-4f2d-bca2-304b5645b342",
    email: "priya@example.com",
    role: Role.BASE,
    created_at: "2026-06-07 11:52:00.000000+00",
    updated_at: "2026-06-07 11:52:00.000000+00",
  },
]

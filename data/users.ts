import { type User } from "@/types";
import { Role } from "@/lib/constants";

export const users: User[] = [
  {
    id: "6025181a-91b2-4e5f-b8d3-7c5d37867f15",
    email: "da11@iitbbs.ac.in",
    role: Role.AUTHENTICATED,
    created_at: "2026-06-07 11:46:03.686287+00",
    updated_at: "2026-06-07 11:46:03.705674+00",
  },
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "amit@example.com",
    role: Role.AUTHENTICATED,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "rahul@example.com",
    role: Role.AUTHENTICATED,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "neha@example.com",
    role: Role.AUTHENTICATED,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
]

import { type User } from "@/types";
import { Role } from "@/lib/constants/enums";

export const users: User[] = [
  // Super Admin
  {
    id: "f1a8e8b8-2b8d-4e9e-b5c6-7a8b9c0d1e2f",
    email: "super@example.com",
    role: Role.SUPER_ADMIN,
    created_at: "2026-06-07 11:46:03.686287+00",
    updated_at: "2026-06-07 11:46:03.705674+00",
  },

  // Factory 1 Users (id: 1)
  {
    id: "056c8f39-b406-4f2d-bca2-304b5645b342",
    email: "admin1a@example.com",
    role: Role.ADMIN,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "156c8f39-b406-4f2d-bca2-304b5645b342",
    email: "admin1b@example.com",
    role: Role.ADMIN,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "1a6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "manager1a@example.com",
    role: Role.MANAGER,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "1b6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "manager1b@example.com",
    role: Role.MANAGER,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "356c8f39-b406-4f2d-bca2-304b5645b342",
    email: "operator1a@example.com",
    role: Role.OPERATOR,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "1d6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "operator1b@example.com",
    role: Role.OPERATOR,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "456c8f39-b406-4f2d-bca2-304b5645b342",
    email: "base1a@example.com",
    role: Role.BASE,
    created_at: "2026-06-07 11:52:00.000000+00",
    updated_at: "2026-06-07 11:52:00.000000+00",
  },
  {
    id: "1f6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "base1b@example.com",
    role: Role.BASE,
    created_at: "2026-06-07 11:52:00.000000+00",
    updated_at: "2026-06-07 11:52:00.000000+00",
  },

  // Factory 2 Users (id: 2)
  {
    id: "2a6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "admin2a@example.com",
    role: Role.ADMIN,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "2b6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "admin2b@example.com",
    role: Role.ADMIN,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "2c6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "manager2a@example.com",
    role: Role.MANAGER,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "2d6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "manager2b@example.com",
    role: Role.MANAGER,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "2e6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "operator2a@example.com",
    role: Role.OPERATOR,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "2f6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "operator2b@example.com",
    role: Role.OPERATOR,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "206c8f39-b406-4f2d-bca2-304b5645b342",
    email: "base2a@example.com",
    role: Role.BASE,
    created_at: "2026-06-07 11:52:00.000000+00",
    updated_at: "2026-06-07 11:52:00.000000+00",
  },
  {
    id: "216c8f39-b406-4f2d-bca2-304b5645b342",
    email: "base2b@example.com",
    role: Role.BASE,
    created_at: "2026-06-07 11:52:00.000000+00",
    updated_at: "2026-06-07 11:52:00.000000+00",
  },

  // Factory 3 Users (id: 3)
  {
    id: "256c8f39-b406-4f2d-bca2-304b5645b342",
    email: "admin3a@example.com",
    role: Role.ADMIN,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "3b6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "admin3b@example.com",
    role: Role.ADMIN,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "3c6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "manager3a@example.com",
    role: Role.MANAGER,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "3d6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "manager3b@example.com",
    role: Role.MANAGER,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "3e6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "operator3a@example.com",
    role: Role.OPERATOR,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "3f6c8f39-b406-4f2d-bca2-304b5645b342",
    email: "operator3b@example.com",
    role: Role.OPERATOR,
    created_at: "2026-06-07 11:50:14.658144+00",
    updated_at: "2026-06-07 11:50:14.658144+00",
  },
  {
    id: "306c8f39-b406-4f2d-bca2-304b5645b343",
    email: "base3a@example.com",
    role: Role.BASE,
    created_at: "2026-06-07 11:52:00.000000+00",
    updated_at: "2026-06-07 11:52:00.000000+00",
  },
  {
    id: "316c8f39-b406-4f2d-bca2-304b5645b343",
    email: "base3b@example.com",
    role: Role.BASE,
    created_at: "2026-06-07 11:52:00.000000+00",
    updated_at: "2026-06-07 11:52:00.000000+00",
  },
];

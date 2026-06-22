interface User {
  id: string
  email: string
  created_at?: string
  updated_at?: string
}

export const users: User[] = [
  // Super Admin
  {
    id: "f4943d15-2783-41a7-acb2-b0947640ad35",
    email: "super@example.com",
    created_at: "2026-06-22 06:24:28.55853+00",
    updated_at: "2026-06-22 06:24:28.581943+00",
  },

  // Factory 1 Users (id: 1)
  {
    id: "ae415e71-05cf-425e-8d49-4fd73d2104ce",
    email: "admin1a@example.com",
    created_at: "2026-06-22 08:05:46.067598+00",
    updated_at: "2026-06-22 08:05:46.08438+00",
  },
  {
    id: "cdff452a-8f3c-450a-9a79-5734927cb291",
    email: "admin1b@example.com",
    created_at: "2026-06-22 09:12:23.877686+00",
    updated_at: "2026-06-22 09:12:23.89744+00",
  },
  {
    id: "062544be-5308-4428-9e33-7f44340da46b",
    email: "manager1a@example.com",
    created_at: "2026-06-22 09:15:59.681069+00",
    updated_at: "2026-06-22 09:15:59.710267+00",
  },
  {
    id: "237bcdb3-97e9-42ba-81a1-707378e21e11",
    email: "manager1b@example.com",
    created_at: "2026-06-22 09:16:19.448989+00",
    updated_at: "2026-06-22 09:16:19.460759+00",
  },
  {
    id: "23eaf1a2-00eb-4eb9-9c53-558e67b3abca",
    email: "operator1a@example.com",
    created_at: "2026-06-22 09:17:08.875678+00",
    updated_at: "2026-06-22 09:17:08.879251+00",
  },
  {
    id: "77377a61-55ec-4f77-93d8-0a54bc9e6f30",
    email: "operator1b@example.com",
    created_at: "2026-06-22 09:19:07.540404+00",
    updated_at: "2026-06-22 09:19:07.550531+00",
  },
  {
    id: "a017ebb3-ff33-495c-854d-e773577c5d2b",
    email: "base1a@example.com",
    created_at: "2026-06-22 09:36:54.128562+00",
    updated_at: "2026-06-22 09:36:54.148783+00",
  },
  {
    id: "705f7a04-77d0-4317-833c-8da8efd14331",
    email: "base1b@example.com",
    created_at: "2026-06-22 09:37:22.744022+00",
    updated_at: "2026-06-22 09:37:22.747506+00",
  },

  // Factory 2 Users (id: 2)
  {
    id: "4a1430c3-a58f-4957-b4cc-cce6ae101b50",
    email: "admin2a@example.com",
    created_at: "2026-06-22 09:37:57.365818+00",
    updated_at: "2026-06-22 09:37:57.374346+00",
  },
  {
    id: "1dfe4326-557a-44d5-97bd-20b397b0e2fb",
    email: "admin2b@example.com",
    created_at: "2026-06-22 09:38:17.785383+00",
    updated_at: "2026-06-22 09:38:17.788949+00",
  },
  {
    id: "1c07ba19-90cf-42be-8fb8-d969833160be",
    email: "manager2a@example.com",
    created_at: "2026-06-22 09:38:42.510893+00",
    updated_at: "2026-06-22 09:38:42.514374+00",
  },
  {
    id: "5eb2af1d-d0ed-40dd-b4ff-f1ead56aee1f",
    email: "manager2b@example.com",
    created_at: "2026-06-22 09:39:13.878181+00",
    updated_at: "2026-06-22 09:39:13.881483+00",
  },
  {
    id: "c0ebe752-8c55-4a0a-8b30-25649f60aa45",
    email: "operator2a@example.com",
    created_at: "2026-06-22 09:39:41.367814+00",
    updated_at: "2026-06-22 09:39:41.371864+00",
  },
  {
    id: "945c1356-0cbc-4691-9184-4f4c014be032",
    email: "operator2b@example.com",
    created_at: "2026-06-22 09:40:04.994683+00",
    updated_at: "2026-06-22 09:40:05.012135+00",
  },
  {
    id: "a9898246-3b55-4f54-8d91-409e537c0044",
    email: "base2a@example.com",
    created_at: "2026-06-22 09:40:25.009783+00",
    updated_at: "2026-06-22 09:40:25.014365+00",
  },
  {
    id: "eb8b09fe-a0eb-40b0-bda4-4593077020e3",
    email: "base2b@example.com",
    created_at: "2026-06-22 09:40:47.408996+00",
    updated_at: "2026-06-22 09:40:47.413293+00",
  },
];

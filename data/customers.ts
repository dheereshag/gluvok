export interface Customer {
  govt_id: number
  name: string
  father_name: string
  village_id: number
  created_at: string
  updated_at: string
}

export const customers: Customer[] = [
  {
    govt_id: 1001,
    name: "Ramesh Kumar",
    father_name: "Mohan Kumar",
    village_id: 1,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    govt_id: 1002,
    name: "Suresh Singh",
    father_name: "Baldev Singh",
    village_id: 2,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    govt_id: 1003,
    name: "Anil Sharma",
    father_name: "Rajesh Sharma",
    village_id: 3,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    govt_id: 1004,
    name: "Pawan Verma",
    father_name: "Mahesh Verma",
    village_id: 4,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    govt_id: 1005,
    name: "Vikas Yadav",
    father_name: "Satish Yadav",
    village_id: 5,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
]

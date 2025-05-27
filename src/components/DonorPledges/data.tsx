import { DonorPledgeDTO } from "./Columns"

export const mockDonorPledges: DonorPledgeDTO[] = [
  {
    Id: "1b3d8fd7-e9a0-4f5c-9d1a-b45c32b3e651",
    DonorId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    DonorName: "John Doe",
    PlannedDate: "2025-06-15",
    Status: "pending",
    BloodType: "A+",
    DonorContact: "+212 6XX-XXXXXX",
    CreatedAt: "2025-05-26"
  },
  {
    Id: "2c4e9fe8-f0b1-5g6d-0e2b-c56d43c4e752",
    DonorId: "b2c3d4e5-f6g7-5b6c-9d0e-1f2a3b4c5d6e",
    DonorName: "Sarah Smith",
    PlannedDate: "2025-06-20",
    Status: "confirmed",
    BloodType: "O-",
    DonorContact: "+212 7XX-XXXXXX",
    CreatedAt: "2025-05-25"
  },
  {
    Id: "3d5f0gf9-h1c2-6h7e-1f3c-d67e54d5e853",
    DonorId: "c3d4e5f6-g7h8-6c7d-0e1f-2a3b4c5d6e7f",
    DonorName: "Mohammed Ali",
    PlannedDate: "2025-06-10",
    Status: "completed",
    BloodType: "B+",
    DonorContact: "+212 5XX-XXXXXX",
    CreatedAt: "2025-05-24"
  },
  {
    Id: "4e6g1hg0-i2d3-7i8f-2g4d-e78f65e6f954",
    DonorId: "d4e5f6g7-h8i9-7d8e-1f2a-3b4c5d6e7f8g",
    DonorName: "Maria Garcia",
    PlannedDate: "2025-06-25",
    Status: "cancelled",
    BloodType: "AB+",
    DonorContact: "+212 6XX-XXXXXX",
    CreatedAt: "2025-05-23"
  }
]

export const getMockDonorPledges = (count: number) => {
  return Array(count)
    .fill(0)
    .map((_, index) => ({
      ...mockDonorPledges[index % mockDonorPledges.length],
      Id: crypto.randomUUID(),
      DonorId: crypto.randomUUID(),
      CreatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
}
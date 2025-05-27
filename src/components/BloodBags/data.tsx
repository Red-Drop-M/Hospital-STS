
export interface BloodBagDTO {
    id: string; // Guid est représenté par string en TypeScript
    BloodBagType: 'blood' | 'plaquette' | 'plasma';
    BloodType: 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+' | 'O-' | 'O+';
    BloodBagStatus?: "aquired" | "ready" | "expired" | "using" | "outforexpired" | "out of stock" | null; // équivalent à BloodBagStatus?
    ExpirationDate?: string | null; // DateOnly représenté comme string (format ISO)
    AcquiredDate?: string | null; // DateOnly représenté comme string (format ISO)
    DonorId?: string | null; // Guid?
    RequestId?: string | null; // Guid?
}
// Helper pour générer des dates aléatoires dans une plage
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
};

export  const mockBloodBags: BloodBagDTO[] = [
  {
    id: "a1b2c3d4-1234-5678-9101-abcdef123456",
    BloodBagType: "blood",
    BloodType: "A+",
    BloodBagStatus: "ready",
    ExpirationDate: randomDate(new Date(2024, 5, 1), new Date(2024, 11, 31)),
    AcquiredDate: randomDate(new Date(2024, 0, 1), new Date(2024, 4, 30)),
    DonorId: "donor-001",
    RequestId: null,
  },
  {
    id: "b2c3d4e5-2345-6789-1011-bcdef1234567",
    BloodBagType: "plasma",
    BloodType: "O-",
    BloodBagStatus: "aquired",
    ExpirationDate: randomDate(new Date(2024, 6, 1), new Date(2024, 11, 31)),
    AcquiredDate: randomDate(new Date(2024, 1, 1), new Date(2024, 5, 30)),
    DonorId: "donor-002",
    RequestId: "request-001",
  },
  {
    id: "c3d4e5f6-3456-7891-0111-cdef12345678",
    BloodBagType: "plaquette",
    BloodType: "AB+",
    BloodBagStatus: "expired",
    ExpirationDate: randomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)), // Date passée
    AcquiredDate: randomDate(new Date(2023, 0, 1), new Date(2023, 5, 30)),
    DonorId: "donor-003",
    RequestId: null,
  },
  {
    id: "d4e5f6g7-4567-8910-1111-def123456789",
    BloodBagType: "blood",
    BloodType: "B-",
    BloodBagStatus: "using",
    ExpirationDate: randomDate(new Date(2024, 3, 1), new Date(2024, 9, 31)),
    AcquiredDate: randomDate(new Date(2024, 1, 1), new Date(2024, 2, 30)),
    DonorId: "donor-004",
    RequestId: "request-002",
  },
  {
    id: "e5f6g7h8-5678-9101-1111-ef1234567890",
    BloodBagType: "plasma",
    BloodType: "O+",
    BloodBagStatus: "out of stock",
    ExpirationDate: randomDate(new Date(2024, 7, 1), new Date(2024, 11, 31)),
    AcquiredDate: randomDate(new Date(2024, 2, 1), new Date(2024, 6, 30)),
    DonorId: "donor-005",
    RequestId: null,
  },
  {
    id: "f6g7h8i9-6789-1011-1111-f12345678901",
    BloodBagType: "blood",
    BloodType: "A-",
    BloodBagStatus: "outforexpired",
    ExpirationDate: randomDate(new Date(2023, 6, 1), new Date(2023, 11, 31)), // Date passée
    AcquiredDate: randomDate(new Date(2023, 1, 1), new Date(2023, 5, 30)),
    DonorId: "donor-006",
    RequestId: "request-003",
  },
  {
    id: "g7h8i9j0-7891-0111-1111-123456789012",
    BloodBagType: "plaquette",
    BloodType: "B+",
    BloodBagStatus: "ready",
    ExpirationDate: randomDate(new Date(2024, 8, 1), new Date(2024, 11, 31)),
    AcquiredDate: randomDate(new Date(2024, 3, 1), new Date(2024, 7, 30)),
    DonorId: "donor-007",
    RequestId: null,
  },
];

// Export pour les tests ou les démos
export const getMockBloodBags = (count: number = 10): BloodBagDTO[] => {
  const bloodTypes: BloodBagDTO["BloodType"][] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statuses: BloodBagDTO["BloodBagStatus"][] = [
    "aquired", "ready", "expired", "using", "outforexpired", "out of stock", null
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `mock-id-${i + 1}-${Math.random().toString(36).substring(2, 10)}`,
    BloodBagType: i % 3 === 0 ? "blood" : i % 3 === 1 ? "plaquette" : "plasma",
    BloodType: bloodTypes[i % bloodTypes.length],
    BloodBagStatus: statuses[i % statuses.length],
    ExpirationDate: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
    AcquiredDate: randomDate(new Date(2023, 6, 1), new Date(2024, 5, 30)),
    DonorId: `donor-mock-${i + 1}`,
    RequestId: i % 4 === 0 ? `request-mock-${i + 1}` : null,
  }));
};
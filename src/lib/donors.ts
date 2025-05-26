// src/api/donors.ts
import { DonorDTO } from "@/components/Donors/columns";

const API_URL = "http://localhost:3001/donors"; // JSON Server
// const API_URL = "http://localhost:5000/donors"; // Pour votre backend réel

// Interface pour la réponse du backend réel
interface BackendResponse<T> {
  Donors?: T[];
  content?: T;
  Donor?: T;
  Total?: number;
}

export const getAllDonors = async (page: number = 1, pageSize: number = 10): Promise<{ donors: DonorDTO[], total: number }> => {
  const response = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) throw new Error('Failed to fetch donors');

  const jsonData = await response.json();

  // Tri des donneurs par ordre décroissant (par exemple, par DateOfBirth ou ID)
  const sortedDonors = jsonData.sort((a: DonorDTO, b: DonorDTO) => {
    // Remplacez `DateOfBirth` par une propriété pertinente comme `createdAt` si disponible
    return new Date(b.DateOfBirth).getTime() - new Date(a.DateOfBirth).getTime();
  });

  return {
    donors: sortedDonors,
    total: jsonData.length,
  };
};

export const createDonor = async (donorData: Omit<DonorDTO, 'Id'>): Promise<CreateDonorResponse> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donorData),
  });

  if (!response.ok) {
    throw new Error('Failed to create donor');
  }

  const data = await response.json();
  return {
    content: data,
    success: true,
    Error: null
  };
};

export const deleteDonor = async (id: string): Promise<boolean> => {
  try {
    // Construisez l'URL correctement
    const url = `${API_URL}/${id}`;
    console.log("DELETE request URL:", url); // Vérifiez l'URL ici

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (response.status === 204 || response.status === 200) {
      return true; // Suppression réussie
    }

    throw new Error(`Failed to delete donor. Status: ${response.status}`);
  } catch (error) {
    console.error("Error deleting donor:", error);
    return false; // Retourne `false` en cas d'erreur
  }
};

export const updateDonor = async (
  id: string,
  updatedData: Partial<DonorDTO>
): Promise<{ success: boolean; content?: DonorDTO; Error?: string }> => {
  try {
    const url = `${API_URL}/${id}`;
    console.log("PUT request URL:", url); // Vérifiez l'URL ici

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, content: data };
    }

    const error = await response.json();
    return { success: false, Error: error.message || "Failed to update donor" };
  } catch (error) {
    console.error("Error updating donor:", error);
    return { success: false, Error: "An unexpected error occurred" };
  }
};

export const getDonor = async (id: string): Promise<DonorDTO | null> => {
  try {
    const response = await fetch(`${API_URL}/donors/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch donor");
    }

    const data = await response.json();
    return data; // Retourne les détails du donneur
  } catch (error) {
    console.error("Error fetching donor:", error);
    return null; // Retourne `null` en cas d'erreur
  }
};

interface CreateDonorResponse {
  content?: DonorDTO;
  success: boolean;
  Error: string | null;
}




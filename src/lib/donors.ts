// src/api/donors.ts
import { DonorDTO } from "@/components/Donors/columns";

const API_URL = "http://localhost:5000/donors"; // JSON Server
// const API_URL = "http://localhost:5000/donors"; // Pour votre backend réel

// Interface pour la réponse du backend réel

interface BackendResponse<T> {
  Donors?: T[];
  content?: T;
  Donor?: T;
  Total?: number;
}

export const getAllDonors = async (page: number = 1, pageSize: number = 10): Promise<{ donors: DonorDTO[], total: number }> => {
  try {
    const response = await fetch(`http://localhost:5000/donors?Page=${page}&PageSize=${pageSize}`);
    if (!response.ok) throw new Error('Failed to fetch donors');

    const data = await response.json();
    console.log("Raw API response:", data);
    
    // Make sure we handle different API response formats
    return {
      // Handle both "donors" and "Donors" properties
      donors: data.donors || data.Donors || [], 
      total: data.total || data.Total || 0
    };
  } catch (error) {
    console.error("Error fetching donors:", error);
    return { donors: [], total: 0 };
  }
};

// Update the type to match your actual interface property (lowercase 'id')
export const createDonor = async (donorData: Omit<DonorDTO, 'id'>): Promise<CreateDonorResponse> => {
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

// Similarly for updateDonor
export const updateDonor = async (
  id: string,
  updatedData: Partial<Omit<DonorDTO, 'id'>>
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




// src/api/donors.ts
import { DonorDTO } from "@/components/Donors/columns";

const API_URL = "https://localhost:57677/donors"; // JSON Server
// const API_URL = "http://localhost:5000/donors"; // Pour votre backend réel

// Interface pour la réponse du backend réel

interface BackendResponse<T> {
  Donors?: T[];
  content?: T;
  Donor?: T;
  Total?: number;
}

export const getAllDonors = async (
  page: number = 1, 
  pageSize: number = 10,
  filters?: {
    Blood?: string,
    regular?: boolean | string,
    searchQuery?: string
  }
): Promise<{ donors: DonorDTO[], total: number }> =>{
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('Page', page.toString());
    queryParams.append('PageSize', pageSize.toString());
    
    // Add filters if they exist
    if (filters?.Blood) queryParams.append('BloodType', filters.Blood);
    if (filters?.regular !== undefined && filters?.regular !== '')
      queryParams.append('Regular', typeof filters.regular === 'boolean' 
        ? filters.regular.toString() 
        : filters.regular);
    if (filters?.searchQuery) queryParams.append('SearchQuery', filters.searchQuery);
    
    // Add sort parameter for LIFO order
    queryParams.append('SortBy', 'CreatedAt');
    queryParams.append('SortOrder', 'desc');
    
    const url = `${API_URL}?${queryParams}`;
    console.log("Fetching donors from:", url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch donors');

    const data = await response.json();
    console.log("Raw API response:", data);
    
    // Handle the specific response format you provided
    return {
      donors: data.donors || [], 
      total: data.total || 0
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

export const deleteDonor = async (id: string): Promise<{success: boolean; errorMessage?: string}> => {
  try {
    // Add validation to ensure id exists and is not undefined
    if (!id) {
      console.error("Cannot delete donor with undefined ID");
      return {success: false, errorMessage: "Donor ID is undefined"};
    }
    
    // Construisez l'URL correctement
    const url = `${API_URL}/${id}`;
    console.log("DELETE request URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      // Add a proper JSON body with the ID
      body: JSON.stringify({ id: id })
    });

    if (response.status === 204 || response.status === 200) {
      return {success: true}; // Deletion successful
    }
    
    // Handle different error status codes differently
    let errorMessage = `Failed to delete donor. Status: ${response.status}`;
    
    // Try to get more detailed error information from the response
    let responseText = "";
    try {
      responseText = await response.text();
      console.log("Error response from server:", responseText);
      
      // Try to parse as JSON if possible
      try {
        const errorJson = JSON.parse(responseText);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (e) {
        // Not JSON, use text as is
        if (responseText) {
          errorMessage = `Server error: ${responseText.substring(0, 100)}`;
        }
      }
    } catch (e) {
      // Unable to read response text
    }
    
    // Special handling for 500 errors - this is your current issue
    if (response.status === 500) {
      errorMessage = "The donor cannot be deleted because it may have blood bags or pledges associated with it. Remove those dependencies first.";
    }

    return {success: false, errorMessage};
  } catch (error) {
    console.error("Error deleting donor:", error);
    return {
      success: false, 
      errorMessage: error instanceof Error ? error.message : "Unknown error occurred"
    }; 
  }
};

// Similarly for updateDonor
export const updateDonor = async (
  id: string,
  updatedData: Partial<Omit<DonorDTO, 'id'>>
): Promise<{ success: boolean; content?: DonorDTO; Error?: string }> => {
  try {
    const url = `${API_URL}/${id}`;
    
    // Include the ID in the request body as specified by your API
    const requestBody = {
      id: id, // Add ID to the body
      ...updatedData
    };
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, content: data };
    }

    const errorText = await response.text();
    let errorMessage = "Failed to update donor";
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch (e) {
      console.error("Non-JSON error response:", errorText);
    }
    
    return { success: false, Error: errorMessage };
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




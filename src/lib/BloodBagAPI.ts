// src/lib/bloodBagAPI.ts
import { BloodBagDTO } from "@/components/BloodBags/data";

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001' 
  : process.env.NEXT_PUBLIC_API_URL;

// Types pour les réponses API
type ApiResponse<T> = {
  data?: T
  error?: string
  statusCode: number
}

// Fetch All Blood Bags avec pagination et filtres
export async function getAllBloodBags(params?: {
  page?: number;
  pageSize?: number;
  bloodType?: string;
  bloodBagType?: string;
  status?: string;
}): Promise<ApiResponse<{ bloodBags: BloodBagDTO[]; total: number }>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('_page', params.page.toString());
    if (params?.pageSize) queryParams.append('_limit', params.pageSize.toString());
    if (params?.bloodType) queryParams.append('BloodType', params.bloodType);
    if (params?.bloodBagType) queryParams.append('BloodBagType', params.bloodBagType);
    if (params?.status) queryParams.append('BloodBagStatus', params.status);

    const response = await fetch(`${API_URL}/blood-bags?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blood bags');
    }

    const total = parseInt(response.headers.get('X-Total-Count') || '0');
    const bloodBags = await response.json();

    return {
      data: { bloodBags, total },
      statusCode: response.status
    };
  } catch (error) {
    console.error('Error fetching blood bags:', error);
    return {
      error: 'Failed to fetch blood bags',
      statusCode: 500
    };
  }
}

// Create Blood Bag
export const createBloodBag = async (bloodBag: BloodBagDTO) => {
    try {
        const response = await fetch(`${API_URL}/blood-bags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bloodBag),
        });

        if (!response.ok) {
            throw new Error('Failed to create blood bag');
        }

        const data = await response.json();
        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'An error occurred',
        };
    }
};

// Update Blood Bag
export async function updateBloodBag(
  id: string,
  data: Partial<Omit<BloodBagDTO, 'id'>>
): Promise<ApiResponse<BloodBagDTO>> {
  try {
    // Correction du chemin de l'endpoint (blood-bags au lieu de bloodbags)
    const response = await fetch(`${API_URL}/blood-bags/${id}`, {
      method: 'PATCH', // Utilisation de PATCH au lieu de PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update blood bag');
    }

    const bloodBag = await response.json();
    return {
      data: bloodBag,
      statusCode: response.status
    };
  } catch (error) {
    console.error('Error updating blood bag:', error);
    return {
      error: 'Failed to update blood bag',
      statusCode: 500
    };
  }
}

// Delete Blood Bag
export async function deleteBloodBag(id: string): Promise<ApiResponse<void>> {
  try {
    // Correction du chemin de l'endpoint (blood-bags au lieu de bloodbags)
    const response = await fetch(`${API_URL}/blood-bags/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete blood bag');
    }

    return {
      statusCode: response.status,
      data: undefined
    };
  } catch (error) {
    console.error('Error deleting blood bag:', error);
    return {
      error: 'Failed to delete blood bag',
      statusCode: 500
    };
  }
}

// Get Single Blood Bag
export async function getBloodBag(id: string): Promise<ApiResponse<BloodBagDTO>> {
  try {
    // Correction du chemin de l'endpoint (blood-bags au lieu de bloodbags)
    const response = await fetch(`${API_URL}/blood-bags/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blood bag');
    }

    const bloodBag = await response.json();
    return {
      data: bloodBag,
      statusCode: response.status
    };
  } catch (error) {
    console.error('Error fetching blood bag:', error);
    return {
      error: 'Failed to fetch blood bag',
      statusCode: 500
    };
  }
}
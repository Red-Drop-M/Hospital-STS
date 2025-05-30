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
    if (params?.page) queryParams.append('pageNumber', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.bloodType) queryParams.append('BloodType', params.bloodType);
    if (params?.bloodBagType) queryParams.append('BloodBagType', params.bloodBagType);
    if (params?.status) queryParams.append('BloodBagStatus', params.status);

    queryParams.append('_t', Date.now().toString());
    
    const url = `http://192.168.1.245:5000/blood-bags?${queryParams}`;
    console.log(`[API] Fetching URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`[API] Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blood bags');
    }

    const total = parseInt(response.headers.get('X-Total-Count') || '0');
    const bloodBags = await response.json();

    return {
      data: { bloodBags, total },
      statusCode: response.status
    };
  } catch (error:any) {
      console.error("Error details:", {
    message: error.message,
    stack: error.stack,
    cause: error.cause
  });
    return {
      error: 'Failed to fetch blood bags',
      statusCode: 500
    };
  }
}

// Create Blood Bag - update the function to match the expected format
export async function createBloodBag(bloodBag: Omit<BloodBagDTO, 'id'>): Promise<ApiResponse<BloodBagDTO>> {
  try {
    // Debug du problème
    console.log("Dans createBloodBag, bloodBag reçu:", bloodBag);
    
    // Création d'un nouvel objet avec les bonnes propriétés
    const requestData = {
      BloodType: bloodBag.BloodType,
      BloodBagType: bloodBag.BloodBagType,
      // Utiliser explicitement Status de bloodBag
      Status: bloodBag.Status || bloodBag.BloodBagStatus, // Fallback à BloodBagStatus si Status est undefined
      ExpirationDate: bloodBag.ExpirationDate,
      AcquiredDate: bloodBag.AcquiredDate,
      DonorId: bloodBag.DonorId,
      RequestId: bloodBag.RequestId
    };
    
    console.log("Creating new blood bag with data:", requestData);
    
    const response = await fetch(`http://192.168.1.245:5000/blood-bags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Failed to create blood bag');
    }

    const data = await response.json();
    return { data, error: undefined, statusCode: response.status };
  } catch (error:any) {
    console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        cause: error.cause
    });
    return {
        data: undefined,
        error: error instanceof Error ? error.message : 'An error occurred',
        statusCode: 500
    };
  }
};

// Update Blood Bag
export async function updateBloodBag(
  id: string,
  data: {
    Id: string;
    BloodType?: string;
    BloodBagType?: string;
    Status?: string; 
    ExpirationDate?: string | null;
    AcquiredDate?: string | null;
    DonorId?: string;
    RequestId?: string | null;
  }
): Promise<ApiResponse<BloodBagDTO>> {
  try {
    // Add console logging to see the exact data being sent
    console.log(`Blood type before update:`, data.BloodType);
    
    // Create a new object with explicit property mapping
    const requestData = {
      id: data.Id,
      bloodType: data.BloodType,       // Try lowercase version
      BloodType: data.BloodType,       // Also include uppercase version
      bloodBagType: data.BloodBagType,
      BloodBagType: data.BloodBagType,
      status: data.Status,
      Status: data.Status,
      expirationDate: data.ExpirationDate,
      ExpirationDate: data.ExpirationDate,
      acquiredDate: data.AcquiredDate || new Date().toISOString().split('T')[0],
      AcquiredDate: data.AcquiredDate || new Date().toISOString().split('T')[0],
      donorId: data.DonorId,
      DonorId: data.DonorId,
      requestId: data.RequestId,
      RequestId: data.RequestId
    };
    
    console.log(`Updating blood bag ${id} with:`, requestData);
    
    const response = await fetch(`http://192.168.1.245:5000/blood-bags/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Failed to update blood bag');
    }

    const bloodBag = await response.json();
    return {
      data: bloodBag,
      statusCode: response.status
    };
  } catch (error:any) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
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
    const response = await fetch(`http://192.168.1.245:5000/blood-bags/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Ensure the body is correctly formatted
    });
    console.log(`Deleting blood bag with ID: ${id}`);
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
    const response = await fetch(`http://192.168.1.245:5000/blood-bags/${id}`);
    
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
import { DonorPledgeDTO } from "@/components/DonorPledges/Columns";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types pour les réponses API
type ApiResponse<T> = {
  data?: T;
  error?: string;
  statusCode: number;
}

// Fetch All DonorPledges avec pagination
export async function getAllDonorPledges(params?: {
  page?: number;
  pageSize?: number;
  bloodType?: string;
  status?: string;
  searchQuery?: string;
}): Promise<ApiResponse<{ donorPledges: DonorPledgeDTO[]; total: number }>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('_page', params.page.toString());
    if (params?.pageSize) queryParams.append('_limit', params.pageSize.toString());
    if (params?.bloodType) queryParams.append('BloodType', params.bloodType);
    if (params?.status) queryParams.append('Status', params.status);
    if (params?.searchQuery) {
      queryParams.append('q', params.searchQuery);
    }

    const response = await fetch(`${API_URL}/donor-pledges?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch donor pledges');
    }

    const total = parseInt(response.headers.get('X-Total-Count') || '0');
    const donorPledges = await response.json();

    return {
      data: { donorPledges, total },
      statusCode: response.status
    };
  } catch (error) {
    console.error('Error fetching donor pledges:', error);
    return {
      error: 'Failed to fetch donor pledges',
      statusCode: 500
    };
  }
}

// Update DonorPledge
export async function updateDonorPledge(
  id: string,
  data: Partial<Omit<DonorPledgeDTO, 'id'>>
): Promise<ApiResponse<DonorPledgeDTO>> {
  try {
    const response = await fetch(`${API_URL}/donor-pledges/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update donor pledge');
    }

    const updatedPledge = await response.json();
    return {
      data: updatedPledge,
      statusCode: response.status
    };
  } catch (error) {
    console.error('Error updating donor pledge:', error);
    return {
      error: 'Failed to update donor pledge',
      statusCode: 500
    };
  }
}
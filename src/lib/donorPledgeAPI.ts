import { DonorPledgeDTO } from "@/components/DonorPledges/Columns";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.245:5000/';

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
    if (params?.bloodType) queryParams.append('bloodType', params.bloodType);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.searchQuery) {
      queryParams.append('q', params.searchQuery);
    }

    // Fix the URL to match your actual endpoint
    const response = await fetch(`http://192.168.1.245:5000/donors-pledges?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch donor pledges');
    }

    const responseData = await response.json();
    console.log("API response:", responseData);
    
    // Transform the data to match your expected format
    const donorPledges = responseData.pledges?.map((pledge: any) => ({
      Id: pledge.id || pledge.donorId, // Ensure there's always an Id
      DonorId: pledge.donorId,
      DonorName: pledge.donorName,
      RequestId: pledge.requestId,
      BloodType: pledge.bloodType,
      PledgeDate: pledge.pledgeDate,
      // Make sure status is never undefined
      Status: pledge.status ? pledge.status.toLowerCase() : "pending"
    })) || [];
    
    const total = responseData.total || 0;

    return {
      data: { donorPledges, total },
      statusCode: responseData.statusCode || 200
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
    const response = await fetch(`http://192.168.1.245:5000/donor-pledges/${id}`, {
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
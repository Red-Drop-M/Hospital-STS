const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestDto {
  id: string;
  bloodType: string;
  bloodBagType: string;
  priority: 'critical' | 'standard' | 'low';
  status: 'pending' | 'resolved' | 'partial' | 'cancled' | 'rejected';
  requestDate: string;
  dueDate?: string;
  requiredQty: number;
  aquiredQty: number;
  moreDetails?: string;
  serviceId?: string;
  donorId?: string;
}

interface ApiResponse<T> {
  content?: T;
  success?: boolean;
  error?: any;
  Message?: string;
  StatusCode?: number;
}

interface ApiListResponse<T> {
  Requests?: T[];
  Total?: number;
  Message?: string;
  StatusCode?: number;
  content?: T[];
  success?: boolean;
  error?: any;
}
type CreateRequest = Partial<Omit<RequestDto,'id'>>;
export async function createRequest(data:CreateRequest ): Promise<RequestDto> {
  // Validation des dates
  const requestData = {
    ...data,
    DueDate: data.dueDate || null,
    RequestDate: data.requestDate
  };
  const response = await fetch(`${API_URL}/bloodrequests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(requestData)
  });

  const result: ApiResponse<RequestDto> = await response.json();
  
  if (!response.ok || (result.StatusCode !== undefined && result.StatusCode >= 400)) {
    throw new Error(result.Message || 'Failed to create request');
  }

  if (!result.content) {
    throw new Error('No request data returned from server');
  }

  return result.content;
}

export async function getRequests(params: {
  Page?: number;
  PageSize?: number;
  Priority?: string;
  BloodBagType?: string;
  RequestDate?: string;
  DueDate?: string;
  DonorId?: string;
  ServiceId?: string;
  Status?: string;
  BloodType?: string;
}): Promise<{ requests: RequestDto[]; total: number }> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.append(key, value.toString());
  });

  try {
    const response = await fetch(`${API_URL}/bloodrequests?${query}`);
    
    if (!response.ok) {
      // Si l'API ne répond pas, utilisez les données mockées directement
      console.warn('API not responding, using fallback data');
      const fallbackData: RequestDto[] = [
        {
          id: "fallback-1",
          bloodType: "A+",
          bloodBagType: "blood",
          priority: "critical",
          status: "pending",
          requestDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          requiredQty: 3,
          aquiredQty: 1,
          moreDetails: "Fallback data"
        }
      ];
      return { requests: fallbackData, total: 1 };
    }

    const data = await response.json();
    
    // Gestion des deux formats de réponse (API réelle et json-server)
    const requests = data.Requests || data.content || data;
    const total = data.Total || (Array.isArray(data) ? data.length : 0);

    return {
      requests: Array.isArray(requests) ? requests : [],
      total
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return { requests: [], total: 0 };
  }
}
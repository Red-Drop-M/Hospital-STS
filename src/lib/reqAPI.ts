const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types d'énumération stricts
export type Priority = 'critical' | 'standard' | 'low';
export type BloodBagType = 'blood' | 'plaquette' | 'plasma';
export type RequestStatus = 'pending' | 'resolved' | 'partial' | 'cancled' | 'rejected';
export type BloodType = 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+' | 'O-' | 'O+';

interface RequestDto {
  id: string;
  bloodType: BloodType;
  bloodBagType: BloodBagType;
  priority: Priority;
  status: RequestStatus;
  requestDate: string;
  dueDate?: string;
  requiredQty: number;
  aquiredQty: number;
  moreDetails?: string;
  serviceId?: string;
  donorId?: string;
}

interface ApiError {
  Message: string;
  ErrorCode?: number;
  Details?: string;
}

async function handleApiError(response: Response): Promise<never> {
  const error: ApiError = await response.json().catch(() => ({
    Message: `Erreur ${response.status}: ${response.statusText}`
  }));
  throw new Error(error.Message);
}

function validateDate(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error("Le format de date doit être YYYY-MM-DD");
  }
  return dateStr;
}

export async function createRequest(data: Omit<RequestDto, 'id'>): Promise<RequestDto> {
  const requestData = {
    BloodType: data.bloodType,
    BloodBagType: data.bloodBagType,
    Priority: data.priority,
    DueDate: data.dueDate ? validateDate(data.dueDate.split('T')[0]) : null,
    MoreDetails: data.moreDetails,
    ServiceId: data.serviceId,
    DonorId: data.donorId,
    RequestStatus: data.status,
    RequestDate: validateDate(data.requestDate.split('T')[0]),
    AquiredQty: data.aquiredQty,
    RequiredQty: data.requiredQty,
  };

  const response = await fetch(`${API_URL}/bloodrequests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) await handleApiError(response);
  return await response.json();
}

interface GetRequestsParams {
  Page?: number;
  PageSize?: number;
  Priority?: Priority;
  BloodBagType?: BloodBagType;
  RequestDate?: string;
  DueDate?: string;
  DonorId?: string;
  ServiceId?: string;
  Status?: RequestStatus;
  BloodType?: BloodType;
}
export async function getRequests(params: GetRequestsParams = {}): Promise<{ requests: RequestDto[]; total: number }> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.append(key, value.toString());
  });

  const response = await fetch(`${API_URL}/bloodrequests?${query}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });

  if (!response.ok) await handleApiError(response);

  const data = await response.json();
  return {
    requests: data.Requests || [],
    total: data.Total || 0
  };
}

export async function deleteRequest(id: string): Promise<{ message: string; statusCode: number }> {
  const response = await fetch(`${API_URL}/bloodrequests/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
  });

  if (!response.ok) await handleApiError(response);

  const data = await response.json();
  return {
    message: data.Message || "Request deleted successfully",
    statusCode: data.StatusCode || 204,
  };
}

export async function getRequest(id: string): Promise<RequestDto> {
  const response = await fetch(`${API_URL}/bloodrequests/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
  });

  if (!response.ok) await handleApiError(response);

  const data = await response.json();
  return data.Request;
}

export async function updateRequest(id: string, data: Partial<Omit<RequestDto, 'id'>>): Promise<RequestDto> {
  const requestData = {
    BloodBagType: data.bloodBagType,
    Priority: data.priority,
    DueDate: data.dueDate ? validateDate(data.dueDate.split('T')[0]) : null,
    MoreDetails: data.moreDetails,
    RequiredQty: data.requiredQty,
    RequestDate: data.requestDate ? validateDate(data.requestDate.split('T')[0]) : null,
  };

  const response = await fetch(`${API_URL}/bloodrequests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) await handleApiError(response);

  const responseData = await response.json();
  return responseData.Request;
}
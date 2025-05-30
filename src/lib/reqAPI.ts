const API_URL = 'http://192.168.1.245:5000';

// Types d'énumération stricts
export type Priority = 'critical' | 'standard' | 'low';
export type BloodBagType = 'blood' | 'plaquette' | 'plasma';
export type RequestStatus = 'pending' | 'resolved' | 'partial' | 'cancled' | 'rejected';
export type BloodType = 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+' | 'O-' | 'O+';

interface RequestDto {
  requestStatus: any;
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
  // Vérifier les champs obligatoires
  if (!data.bloodType || !data.bloodBagType || !data.priority || !data.requestDate) {
    throw new Error("Les champs bloodType, bloodBagType, priority et requestDate sont obligatoires");
  }

  // Normaliser les dates
  const formatDate = (dateStr: string | undefined): string | null => {
    if (!dateStr) return null;
    // Extraire la partie YYYY-MM-DD de la date
    const dateMatch = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      return dateMatch[0]; // Retourner juste YYYY-MM-DD
    }
    return null;
  };

  // Créer l'objet de données avec les bons noms de champs et formats
  const requestData = {
    bloodType: data.bloodType,
    bloodBagType: data.bloodBagType.toLowerCase(),
    priority: data.priority.toLowerCase(),
    status: data.status?.toLowerCase() || "pending",
    requestDate: formatDate(data.requestDate),
    dueDate: formatDate(data.dueDate),
    requiredQty: data.requiredQty || 1,
    aquiredQty: data.aquiredQty || 0,
    moreDetails: data.moreDetails || "",
    serviceId: data.serviceId || null,
    donorId: data.donorId || null
  };
  
  console.log('Création d\'une nouvelle demande avec données:', requestData);
  
  const response = await fetch(`http://192.168.1.245:5000/bloodrequests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify(requestData),
  });
  
  // Capturer et afficher l'erreur complète du serveur
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Réponse d'erreur du serveur:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || errorJson.error || `Erreur ${response.status}`);
    } catch (e) {
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }
  }

  const responseData = await response.json();
  console.log('Réponse du backend:', responseData);
  
  return responseData;
}


interface GetRequestsParams {
  page?: number;
  pageSize?: number;
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


  const response = await fetch(`http://192.168.1.245:5000/bloodrequests?${query}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    
  });

  if (!response.ok) await handleApiError(response);

  const data = await response.json();
  return {
    requests: data.Requests || [],
    total: data.total || 0
  };
}

export async function deleteRequest(id: string): Promise<{ message: string; statusCode: number }> {
  const response = await fetch(`http://192.168.1.245:5000/bloodrequests/${id}`, {
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
  // Ajout de tous les champs nécessaires
  const requestData = {
    id,
    BloodType: data.bloodType,           // Ajouté
    BloodBagType: data.bloodBagType,
    Priority: data.priority,
    ReqyestDate: data.requestDate ? validateDate(data.requestDate.split('T')[0]) : null,
    RequestStatus: data.status,          // Ajouté
    DueDate: data.dueDate ? validateDate(data.dueDate.split('T')[0]) : null,
    MoreDetails: data.moreDetails,
    RequiredQty: data.requiredQty,
    AquiredQty: data.aquiredQty,        // Ajouté
    RequestDate: data.requestDate ? validateDate(data.requestDate.split('T')[0]) : null,
    ServiceId: data.serviceId,          // Ajouté
    DonorId: data.donorId              // Ajouté
  };

  console.log('Sending update data:', requestData); // Pour le débogage

  const response = await fetch(`http://192.168.1.245:5000/bloodrequests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) await handleApiError(response);

  const responseData = await response.json();
  console.log("Raw API response:", responseData);
  
  // Handle different possible response structures
  if (responseData.Request) {
    return responseData.Request;
  } else if (responseData.requestDate || responseData.RequestDate) {
    // Direct response object
    return responseData;
  } else {
    // Create a fallback response if the API doesn't return the expected format
    return {
      id: id,
      bloodType: data.bloodType as BloodType,
      bloodBagType: data.bloodBagType as BloodBagType,
      priority: data.priority as Priority,
      status: data.status as RequestStatus,
      requestDate: data.requestDate || new Date().toISOString(),
      dueDate: data.dueDate,
      requiredQty: data.requiredQty || 0,
      aquiredQty: data.aquiredQty || 0,
      moreDetails: data.moreDetails || "",
      serviceId: data.serviceId || "",
      donorId: data.donorId || "",
      requestStatus: data.status as RequestStatus
    };
  }
}
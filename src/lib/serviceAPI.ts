// src/lib/serviceAPI.ts
import { ServiceDTO } from '../types/service';

const API_URL = 'http://192.168.1.245:5000';

// Types pour les réponses API
type ApiResponse<T> = {
  data?: T
  error?: string
  statusCode: number
}

// Récupération de tous les services avec pagination
export async function getAllServices(params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<{ services: ServiceDTO[]; total: number }>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('Page', params.page.toString());
    if (params?.pageSize) queryParams.append('PageSize', params.pageSize.toString());

    queryParams.append('_t', Date.now().toString()); // Cache busting
    
    const url = `${API_URL}/services?${queryParams}`;
    console.log(`[API] Fetching services URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    console.log(`[API] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Failed to fetch services: ${response.status}`);
    }

    const data = await response.json();
    console.log('Services data received:', data);
    
    if (data) {
      console.log('Services received:', data.services)
      
      // Transformer les données pour correspondre à votre interface
      const formattedServices = data.services.map((service: any) => ({
          id: service.id,
          Name: service.name || service.Name // Accepte les deux formats
      }));
      
      return {
        data: { 
          services: formattedServices,
          total: data.total
        },
        statusCode: response.status
      };
    }

    return {
      data: { 
        services: [],
        total: 0
      },
      statusCode: response.status
    };
  } catch (error: any) {
    console.error("Error fetching services:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return {
      error: 'Failed to fetch services',
      statusCode: 500
    };
  }
}

// Création d'un service
export async function createService(data: { Name: string }): Promise<ApiResponse<ServiceDTO>> {
  try {
    console.log('Creating new service with data:', data);
    
    const response = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Service creation error:', errorText);
      throw new Error(`Failed to create service: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Service created successfully:', responseData);
    
    return { 
      data: responseData.content, 
      statusCode: response.status 
    };
  } catch (error: any) {
    console.error("Error creating service:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return {
      error: error instanceof Error ? error.message : 'Failed to create service',
      statusCode: 500
    };
  }
}

// Mise à jour d'un service
export async function updateService(id: string, data: { Name: string }): Promise<ApiResponse<ServiceDTO>> {
  try {
    console.log(`Updating service ${id} with data:`, data);
    
    // CORRECTION: Envoyer uniquement Name dans le body, pas Id
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ Name: data.Name }), // Envoi de Name uniquement
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Service update error:', errorText);
      throw new Error(`Failed to update service: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Service updated successfully:', responseData);
    
    return { 
      data: responseData.service, // ✅ Corrigé: utilisation de minuscules
      statusCode: responseData.status || response.status // ✅ Corrigé: utilisation de minuscules
    };
  } catch (error: any) {
    console.error("Error updating service:", error);
    return {
      error: error instanceof Error ? error.message : 'Failed to update service',
      statusCode: 500
    };
  }
}

// Suppression d'un service
export async function deleteService(id: string): Promise<ApiResponse<void>> {
  try {
    console.log(`Deleting service with ID: ${id}`);
    
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      // Ajout du corps JSON avec l'ID - c'est ce qui manquait
      body: JSON.stringify({ Id: id })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Service deletion error:', errorText);
      throw new Error(`Failed to delete service: ${response.status}`);
    }

    // Traitement de la réponse
    let responseData;
    try {
      responseData = await response.json();
      console.log('Service deleted successfully with response:', responseData);
    } catch (e) {
      console.log('No JSON response for delete operation');
    }
    
    return {
      statusCode: 204,
      // message: responseData?.Message || "Service deleted successfully"
    };
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return {
      error: error instanceof Error ? error.message : 'Failed to delete service',
      statusCode: 500
    };
  }
}

// Récupération d'un service par ID
export async function getService(id: string): Promise<ApiResponse<ServiceDTO>> {
  try {
    console.log(`Fetching service with ID: ${id}`);
    
    const response = await fetch(`${API_URL}/services/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Service fetch error:', errorText);
      throw new Error(`Failed to fetch service: ${response.status}`);
    }

    const data = await response.json();
    console.log('Service fetched successfully:', data);
    
    return { 
      data: data.Service, 
      statusCode: response.status 
    };
  } catch (error: any) {
    console.error("Error fetching service:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch service',
      statusCode: 500
    };
  }
}

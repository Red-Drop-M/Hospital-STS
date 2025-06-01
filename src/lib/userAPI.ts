import { UserDTO } from '@/app/users/Columns';

const API_URL = 'https://localhost:57677';

type ApiResponse<T> = {
  data?: T;
  error?: string;
  statusCode: number;
  message?: string;
};

// Récupérer tous les utilisateurs
export async function getAllUsers({ page = 1, pageSize = 10 } = {}): Promise<ApiResponse<{ users: UserDTO[]; total: number }>> {
  try {
    const url = `${API_URL}/admin/users`;
    console.log(`[API] Fetching users URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    console.log(`[API] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const data = await response.json();
    console.log('Users data received:', data);
    
    // Adapter les données pour notre interface UserDTO
    if (data && data.Users) {
      return {
        data: { 
          users: data.Users.map((user: any) => ({
            id: user.Id,
            FirstName: user.Name.split(' ')[0] || '',
            LastName: user.Name.split(' ')[1] || '',
            Email: user.Email,
            Role: user.Role,
            DateOfBirth: user.DateOfBirth,
            PhoneNumber: user.PhoneNumber,
            Address: user.Address
          })),
          total: data.Users.length
        },
        statusCode: response.status
      };
    }
    
    // Cas où le backend renvoie un format différent
    if (data && data.users) {
      return {
        data: { 
          users: data.users.map((user: any) => ({
            id: user.id || user.Id,
            FirstName: user.name?.split(' ')[0] || user.Name?.split(' ')[0] || '',
            LastName: user.name?.split(' ')[1] || user.Name?.split(' ')[1] || '',
            Email: user.email || user.Email,
            Role: user.role || user.Role,
            DateOfBirth: user.dateOfBirth || user.DateOfBirth,
            PhoneNumber: user.phoneNumber || user.PhoneNumber,
            Address: user.address || user.Address
          })),
          total: data.users.length
        },
        statusCode: response.status
      };
    }
    
    return {
      data: { 
        users: [],
        total: 0
      },
      statusCode: response.status,
      error: "Format de données inattendu"
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch users',
      statusCode: 500,
      data: { users: [], total: 0 }
    };
  }
}

// Créer un nouvel utilisateur
export async function createUser(data: { 
  FirstName: string; 
  LastName: string; 
  Email: string; 
  Password: string;
  Role: string;
}): Promise<ApiResponse<UserDTO>> {
  try {
    console.log("Creating user with data:", data);
    
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        Name: `${data.FirstName} ${data.LastName}`,
        Email: data.Email,
        Password: data.Password,
        Role: data.Role,
        DateOfBirth: new Date(),
        PhoneNumber: "",
        Address: ""
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('User creation error:', errorText);
      throw new Error(`Failed to create user: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('User created successfully:', responseData);
    
    // Adapter selon la réponse de votre backend
    return { 
      data: {
        id: responseData.Id,
        FirstName: responseData.Name.split(' ')[0] || '',
        LastName: responseData.Name.split(' ')[1] || '',
        Email: responseData.Email,
        Role: responseData.Role,
        DateOfBirth: responseData.DateOfBirth,
        PhoneNumber: responseData.PhoneNumber,
        Address: responseData.Address
      },
      statusCode: response.status 
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      error: error instanceof Error ? error.message : 'Failed to create user',
      statusCode: 500
    };
  }
}

// Mettre à jour un utilisateur
export async function updateUser(id: string, data: { 
  FirstName: string; 
  LastName: string; 
  Email: string; 
  Password?: string;
  Role: string;
}): Promise<ApiResponse<UserDTO>> {
  try {
    console.log(`Updating user ${id} with data:`, data);
    
    // Préparer les données pour le backend
    const updateData: any = {
      id: id,
      Name: `${data.FirstName} ${data.LastName}`,
      Email: data.Email,
      Role: data.Role
    };
    
    // N'inclure le mot de passe que s'il est fourni et non vide
    if (data.Password && data.Password.trim() !== '') {
      updateData.Password = data.Password;
    }
    
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('User update error:', errorText);
      throw new Error(`Failed to update user: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('User updated successfully:', responseData);
    
    // Adapter selon la réponse de votre backend
    return { 
      data: {
        id: responseData.Id,
        FirstName: responseData.Name.split(' ')[0] || '',
        LastName: responseData.Name.split(' ')[1] || '',
        Email: responseData.Email,
        Role: responseData.Role,
        DateOfBirth: responseData.DateOfBirth,
        PhoneNumber: responseData.PhoneNumber,
        Address: responseData.Address
      },
      statusCode: response.status 
    };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return {
      error: error instanceof Error ? error.message : 'Failed to update user',
      statusCode: 500
    };
  }
}

// Supprimer un utilisateur
export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  try {
    console.log(`Deleting user with ID: ${id}`);
    
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('User deletion error:', errorText);
      throw new Error(`Failed to delete user: ${response.status}`);
    }

    // Lire la réponse JSON si présente
    let responseData;
    try {
      responseData = await response.json();
      console.log('User deleted successfully with response:', responseData);
    } catch (e) {
      console.log('No JSON response for delete operation');
    }
    
    return {
      statusCode: 204,
      message: responseData?.message || "User deleted successfully"
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      error: error instanceof Error ? error.message : 'Failed to delete user',
      statusCode: 500
    };
  }
}
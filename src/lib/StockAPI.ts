// Types pour les stocks globaux
export type BloodType = | "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+" | "O-" | "O+";

export type BloodBagType = "blood" | "plaquette" | "plasma"

export interface GlobalStockDTO {
  BloodType: BloodType
  BloodBagType: BloodBagType
  CountExpired: number
  CountExpiring: number
  ReadyCount: number
  MinStock: number
  CriticalStock: number
}

export interface GlobalStock extends GlobalStockDTO {
  isCritical: boolean
}

// Configuration partagée
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
const API_BASE_URL = "http://localhost:3001"

export type ApiResponse<T> = {
  data?: T
  error?: string
  statusCode: number
}

type GlobalStockResponse = {
  GlobalStock?: GlobalStockDTO
  Message?: string
  StatusCode: number
}

type GlobalStocksListResponse = {
  GlobalStocks?: GlobalStockDTO[]
  Total?: number
  Message?: string
  StatusCode: number
}


export async function getAllGlobalStocks(
  bloodType?: string,
  bloodBagType?: string,
  critical?: boolean
): Promise<ApiResponse<GlobalStock[]>> {
  try {
    // Build the URL with query parameters
    const url = new URL(`http://192.168.1.245:5000/global-stocks`);
    if (bloodType) url.searchParams.append("bloodType", bloodType);
    if (bloodBagType) url.searchParams.append("bloodBagType", bloodBagType);
    if (critical !== undefined) url.searchParams.append("critical", String(critical));

    console.log("Fetching global stocks from:", url.toString());
    
    // Make the fetch request without additional headers - match the working blood bags approach
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      try {
        const errorData = await response.json();
        return { 
          error: errorData.message || errorData.Message || "Failed to fetch global stocks", 
          statusCode: response.status 
        };
      } catch (parseError) {
        return { 
          error: `Failed to fetch global stocks: ${response.statusText}`, 
          statusCode: response.status 
        };
      }
    }

    // Get full response data
    const responseData = await response.json();
    console.log("Global stocks API response:", responseData);
    
    // More flexible structure checking - handle multiple possible response formats
    if (!responseData) {
      console.error("Empty API response");
      return { error: "Empty response from API", statusCode: 200 };
    }
    
    // Handle different possible response structures
    let stocksData = [];
    
    // Case 1: Direct array of stocks
    if (Array.isArray(responseData)) {
      stocksData = responseData;
    }
    // Case 2: {globalStocks: [...]} format (lowercase)
    else if (responseData.globalStocks && Array.isArray(responseData.globalStocks)) {
      stocksData = responseData.globalStocks;
    }
    // Case 3: {GlobalStocks: [...]} format (uppercase)
    else if (responseData.GlobalStocks && Array.isArray(responseData.GlobalStocks)) {
      stocksData = responseData.GlobalStocks;
    }
    // Case 4: Data is nested differently
    else {
      console.error("Unexpected API response format:", responseData);
      // Try to extract data from the structure if possible
      const possibleArrays = Object.values(responseData).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        stocksData = possibleArrays[0] as any[];
      } else {
        return { error: "Invalid response format from API", statusCode: 200 };
      }
    }
    
    // Map the fields - handle different field name cases
    const stocks: GlobalStock[] = stocksData.map((stock: any) => ({
      BloodType: stock.bloodType || stock.BloodType || "",
      BloodBagType: stock.bloodBagType || stock.BloodBagType || "",
      CountExpired: stock.countExpired || stock.CountExpired || 0,
      CountExpiring: stock.countExpiring || stock.CountExpiring || 0,
      readyCount: stock.readyCount || stock.ReadyCount || 0,
      MinStock: stock.minStock || stock.MinStock || 0,
      CriticalStock: stock.criticalStock || stock.CriticalStock || 0,
      isCritical: (stock.readyCount || stock.ReadyCount || 0) < 
                 (stock.criticalStock || stock.CriticalStock || 0)
    }));

    return { 
      data: stocks, 
      statusCode: responseData.statusCode || 200 
    };
  } catch (error) {
    console.error("Error fetching global stocks:", error);
    return { 
      error: `Network error while fetching global stocks: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      statusCode: 500 
    };
  }
}


export async function getGlobalStock(
  bloodType: string, 
  bloodBagType: string
): Promise<ApiResponse<GlobalStock>> {
  try {
    const url = new URL(`${API_BASE_URL}/global-stocks/by-key`);
    url.searchParams.append("bloodType", bloodType);
    url.searchParams.append("bloodBagType", bloodBagType);

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        // Remove auth header
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json()
      return { 
        error: errorData.Message || "Failed to fetch global stock", 
        statusCode: response.status 
      }
    }

    const data: GlobalStockResponse = await response.json()
    
    if (!data.GlobalStock) {
      return { 
        error: "Global stock not found", 
        statusCode: 404 
      }
    }

    const stock: GlobalStock = {
      ...data.GlobalStock,
      isCritical: data.GlobalStock.ReadyCount < data.GlobalStock.CriticalStock
    }

    return { 
      data: stock, 
      statusCode: response.status 
    }
  } catch (error) {
    console.error("Error fetching global stock:", error)
    return { 
      error: "Network error while fetching global stock", 
      statusCode: 500 
    }
  }
}

export async function createGlobalStock(
  stockData: Omit<GlobalStock, "isCritical">
): Promise<ApiResponse<GlobalStock>> {
  try {
    const response = await fetch(`http://192.168.1.245:5000/global-stocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stockData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { 
        error: errorData.Message || "Failed to create global stock", 
        statusCode: response.status 
      }
    }

    const data: GlobalStockResponse = await response.json()
    
    if (!data.GlobalStock) {
      return { 
        error: "Global stock creation failed", 
        statusCode: 500 
      }
    }

    const stock: GlobalStock = {
      ...data.GlobalStock,
      isCritical: data.GlobalStock.ReadyCount < data.GlobalStock.CriticalStock
    }

    return { 
      data: stock, 
      statusCode: response.status 
    }
  } catch (error) {
    console.error("Error creating global stock:", error)
    return { 
      error: "Network error while creating global stock", 
      statusCode: 500 
    }
  }
}

export async function updateGlobalStock(
  bloodType: string,
  bloodBagType: string,
  updateData: Partial<Omit<GlobalStock, "bloodType" | "bloodBagType">>
): Promise<ApiResponse<GlobalStock>> {
  try {
    const response = await fetch(`http://192.168.1.245:5000/global-stocks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bloodType,
        bloodBagType,
        ...updateData
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { 
        error: errorData.Message || "Failed to update global stock", 
        statusCode: response.status 
      }
    }

    const data: GlobalStockResponse = await response.json()
    
    if (!data.GlobalStock) {
      return { 
        error: "Global stock update failed", 
        statusCode: 500 
      }
    }

    const stock: GlobalStock = {
      ...data.GlobalStock,
      isCritical: data.GlobalStock.ReadyCount < data.GlobalStock.CriticalStock
    }

    return { 
      data: stock, 
      statusCode: response.status 
    }
  } catch (error) {
    console.error("Error updating global stock:", error)
    return { 
      error: "Network error while updating global stock", 
      statusCode: 500 
    }
  }
}

export async function deleteGlobalStock(
  bloodType: string, 
  bloodBagType: string
): Promise<ApiResponse<void>> {
  try {
    const url = new URL(`http://192.168.1.245:5000/global-stocks`)
    url.searchParams.append("bloodType", bloodType)
    url.searchParams.append("bloodBagType", bloodBagType)

    const response = await fetch(url.toString(), {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { 
        error: errorData.Message || "Failed to delete global stock", 
        statusCode: response.status 
      }
    }

    return { 
      statusCode: response.status 
    }
  } catch (error) {
    console.error("Error deleting global stock:", error)
    return { 
      error: "Network error while deleting global stock", 
      statusCode: 500 
    }
  }
}
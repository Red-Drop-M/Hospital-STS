// Types pour les stocks globaux
export type BloodType = 
  | "A-" | "A+" 
  | "B-" | "B+" 
  | "AB-" | "AB+" 
  | "O-" | "O+"

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
const API_BASE_URL = USE_MOCK_API 
  ? "http://localhost:3001" 
  : process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables")
}

// Types pour les réponses API
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
    const url = new URL(`${API_BASE_URL}/global-stocks`)
    if (bloodType) url.searchParams.append("bloodType", bloodType)
    if (bloodBagType) url.searchParams.append("bloodBagType", bloodBagType)
    if (critical !== undefined) url.searchParams.append("critical", String(critical))

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      const errorData = await response.json()
      return { 
        error: errorData.Message || "Failed to fetch global stocks", 
        statusCode: response.status 
      }
    }

    const data: GlobalStocksListResponse = await response.json()
    
    const stocks: GlobalStock[] = (data.GlobalStocks || []).map(stock => ({
      ...stock,
      isCritical: stock.ReadyCount < stock.CriticalStock
    }))

    return { 
      data: stocks, 
      statusCode: response.status 
    }
  } catch (error) {
    console.error("Error fetching global stocks:", error)
    return { 
      error: "Network error while fetching global stocks", 
      statusCode: 500 
    }
  }
}


export async function getGlobalStock(
  bloodType: string, 
  bloodBagType: string
): Promise<ApiResponse<GlobalStock>> {
  try {
    const url = new URL(`${API_BASE_URL}/global-stocks/by-key`)
    url.searchParams.append("bloodType", bloodType)
    url.searchParams.append("bloodBagType", bloodBagType)

    const response = await fetch(url.toString())
    
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
    const response = await fetch(`${API_BASE_URL}/global-stocks`, {
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
    const response = await fetch(`${API_BASE_URL}/global-stocks`, {
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
    const url = new URL(`${API_BASE_URL}/global-stocks`)
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
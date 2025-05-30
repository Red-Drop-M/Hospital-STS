// import { BloodStockChartData, GlobalStockDTO } from "@/types/stock";

// const API_URL = process.env.NODE_ENV === 'development' 
//   ? 'http://localhost:3001' 
//   : process.env.NEXT_PUBLIC_API_URL;

// export const fetchBloodStockChartData = async (bloodBagType: string = "Plasma"): Promise<BloodStockChartData[]> => {
//   const response = await fetch(
//     `${API_URL}/global-stocks?bloodBagType=${bloodBagType}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch blood stock data");
//   }

//   const stocks: GlobalStockDTO[] = await response.json();

  
//   const allBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//   const initialData = allBloodTypes.map(type => ({
//     name: type,
//     units: 0,
//     critical: 0
//   }));

  
//   const result = stocks.reduce((acc, stock) => {
//     const existing = acc.find(item => item.name === stock.bloodType);
//     if (existing) {
//       existing.units += stock.readyCount;
//       existing.critical = stock.criticalStock; 
//     }
//     return acc;
//   }, [...initialData]);

//   return result;
// };
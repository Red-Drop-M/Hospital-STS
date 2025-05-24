export interface BloodStockChartData {
  name: string;
  units: number;
  critical: number;
}

export interface GlobalStockDTO {
  bloodType: string;
  bloodBagType: string;
  readyCount: number;
  criticalStock: number;
}
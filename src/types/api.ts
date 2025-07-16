export interface MonthlyData {
  plan: number | null;
  fact: number | null;
}

export interface ManagerData {
  name: string;
  income: {
    [month: string]: MonthlyData;
  };
  activePartners: {
    [month: string]: MonthlyData;
  };
}

export interface ApiResponse {
  managers: ManagerData[];
  totalIncome: {
    [month: string]: MonthlyData;
  };
  totalActivePartners: {
    [month: string]: MonthlyData;
  };
}

export interface RawApiMonthData {
  income: number;
  activePartners: number;
  plan: {
    income: number;
    activePartners: number;
  };
  fact: {
    income: number;
    activePartners: number;
  };
}

export interface RawApiManager {
  id: number;
  adminId: number;
  adminName: string;
  months: RawApiMonthData[];
}

export interface RawApiResponse {
  success: boolean;
  data: {
    total: RawApiMonthData[];
    table: RawApiManager[];
    year?: number;
  };
}

export const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
] as const;

export type Month = typeof MONTHS[number]; 

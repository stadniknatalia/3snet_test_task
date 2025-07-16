import { ApiResponse, RawApiResponse, MONTHS, MonthlyData, ManagerData } from '../types/api';

export const transformApiData = (rawData: RawApiResponse): ApiResponse & { year: number } => {
  const totalIncome: { [month: string]: MonthlyData } = {};
  const totalActivePartners: { [month: string]: MonthlyData } = {};

  rawData.data.total.forEach((monthData, index) => {
    const month = MONTHS[index];
    totalIncome[month] = {
      plan: monthData.plan.income,
      fact: monthData.fact.income
    };
    totalActivePartners[month] = {
      plan: monthData.plan.activePartners,
      fact: monthData.fact.activePartners
    };
  });

  const managers: ManagerData[] = rawData.data.table.map(rawManager => {
    const income: { [month: string]: MonthlyData } = {};
    const activePartners: { [month: string]: MonthlyData } = {};

    rawManager.months.forEach((monthData, index) => {
      const month = MONTHS[index];
      income[month] = {
        plan: monthData.plan.income,
        fact: monthData.fact.income
      };
      activePartners[month] = {
        plan: monthData.plan.activePartners,
        fact: monthData.fact.activePartners
      };
    });

    return {
      name: rawManager.adminName,
      income,
      activePartners
    };
  });

  return {
    managers,
    totalIncome,
    totalActivePartners,
    year: rawData.data.year || 2025
  };
}; 

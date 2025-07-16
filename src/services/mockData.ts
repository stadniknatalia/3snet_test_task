import { ApiResponse, MONTHS } from '../types/api';

export const generateMockData = (): ApiResponse & { year: number } => {
  const managers = [
    'Mikhail Reshetnikov',
    'Timirgaan Altanov', 
    'Alexandra Veresovich',
    'Alexandra Ivanova',
    'Peter Petrov'
  ];

  const generateMonthlyData = () => {
    const data: { [key: string]: { plan: number | null; fact: number | null } } = {};
    MONTHS.forEach(month => {
      data[month] = {
        plan: Math.floor(Math.random() * 200000) + 50000,
        fact: Math.floor(Math.random() * 150000) + 60000
      };
    });
    return data;
  };

  const generatePartnersData = () => {
    const data: { [key: string]: { plan: number | null; fact: number | null } } = {};
    MONTHS.forEach(month => {
      data[month] = {
        plan: Math.floor(Math.random() * 150) + 50,
        fact: Math.floor(Math.random() * 120) + 60
      };
    });
    return data;
  };

  const managerData = managers.map(name => ({
    name,
    income: generateMonthlyData(),
    activePartners: generatePartnersData()
  }));

  const totalIncome: { [key: string]: { plan: number | null; fact: number | null } } = {};
  const totalActivePartners: { [key: string]: { plan: number | null; fact: number | null } } = {};

  MONTHS.forEach(month => {
    let planIncomeSum = 0;
    let factIncomeSum = 0;
    let planPartnersSum = 0;
    let factPartnersSum = 0;

    managerData.forEach(manager => {
      planIncomeSum += manager.income[month]?.plan || 0;
      factIncomeSum += manager.income[month]?.fact || 0;
      planPartnersSum += manager.activePartners[month]?.plan || 0;
      factPartnersSum += manager.activePartners[month]?.fact || 0;
    });

    totalIncome[month] = {
      plan: planIncomeSum,
      fact: factIncomeSum
    };

    totalActivePartners[month] = {
      plan: planPartnersSum,
      fact: factPartnersSum
    };
  });

  return {
    managers: managerData,
    totalIncome,
    totalActivePartners,
    year: new Date().getFullYear()
  };
}; 

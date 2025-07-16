import React, { useState, useEffect } from 'react';
import { ApiResponse, ManagerData, MONTHS, Month, MonthlyData, RawApiResponse } from './types/api';
import { generateMockData } from './services/mockData';
import { transformApiData } from './services/dataTransform';
import './App.css';

const App: React.FC = () => {
  const [data, setData] = useState<(ApiResponse & { year: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleMonths, setVisibleMonths] = useState<Month[]>([]);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const initialMonths = [];
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth + i) % 12;
      initialMonths.push(MONTHS[monthIndex]);
    }
    setVisibleMonths(initialMonths as Month[]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://3snet.co/js_test/api.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const rawApiData: RawApiResponse = await response.json();
        console.log('Raw API Data received:', rawApiData);
        
        if (rawApiData && rawApiData.success && rawApiData.data && rawApiData.data.table) {
          const transformedData = transformApiData(rawApiData);
          console.log('Transformed data:', transformedData);
          setData(transformedData);
        } else {
          console.warn('API data has unexpected structure, using mock data');
          setData(generateMockData());
        }
      } catch (err) {
        console.warn('API fetch failed, using mock data:', err);
        setData(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const shiftMonths = (direction: 'left' | 'right') => {
    setVisibleMonths((prev: Month[]) => {
      const currentFirstMonthIndex = MONTHS.indexOf(prev[0]);
      let newFirstMonthIndex;
      
      if (direction === 'left') {
        newFirstMonthIndex = (currentFirstMonthIndex - 1 + 12) % 12;
      } else {
        newFirstMonthIndex = (currentFirstMonthIndex + 1) % 12;
      }
      
      const newMonths = [];
      for (let i = 0; i < 6; i++) {
        const monthIndex = (newFirstMonthIndex + i) % 12;
        newMonths.push(MONTHS[monthIndex]);
      }
      return newMonths as Month[];
    });
  };

  const formatCurrency = (value: number | null): string => {
    if (value === null) return '$0';
    return `$${value.toLocaleString()}`;
  };

  const getMonthDisplayName = (month: Month): string => {
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  const renderCell = (data: MonthlyData | undefined, type: 'currency' | 'number') => {
    if (!data) return { plan: '-', fact: '-' };
    
    if (type === 'currency') {
      return {
        plan: formatCurrency(data.plan),
        fact: formatCurrency(data.fact)
      };
    } else {
      return {
        plan: data.plan?.toString() || '0',
        fact: data.fact?.toString() || '0'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }



  if (!data || visibleMonths.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen max-w-app max-h-app mx-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            1
          </span>
          <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            2
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => shiftMonths('left')}
            className="p-2 hover:bg-gray-200 rounded"
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="font-medium">Year {data?.year || 2025}</span>
          <button
            onClick={() => shiftMonths('right')}
            className="p-2 hover:bg-gray-200 rounded"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add plan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 w-48">
              </th>
              {visibleMonths.map((month) => (
                <th key={month} className="px-3 py-3 text-center text-sm font-medium text-gray-900 border-l">
                  <div className="mb-2">{getMonthDisplayName(month)}</div>
                  <div className="flex">
                    <div className="flex-1 text-xs text-gray-600 px-2">Plan</div>
                    <div className="flex-1 text-xs text-gray-600 px-2 border-l">Fact</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t bg-blue-50">
              <td className="px-4 py-4 font-medium text-sm text-gray-900">Manager</td>
                             {visibleMonths.map((month) => {
                const incomeData = renderCell(data.totalIncome?.[month], 'currency');
                return (
                  <td key={`manager-income-${month}`} className="px-3 py-2 text-center text-sm border-l">
                    <div className="mb-1 text-xs text-gray-600">Total income:</div>
                    <div className="flex">
                      <div className="flex-1 px-2">{incomeData.plan}</div>
                      <div className="flex-1 px-2 border-l">{incomeData.fact}</div>
                    </div>
                  </td>
                );
              })}
            </tr>
            <tr className="bg-blue-50">
              <td className="px-4 py-2"></td>
              {visibleMonths.map((month) => {
                const partnersData = renderCell(data.totalActivePartners?.[month], 'number');
                return (
                  <td key={`manager-partners-${month}`} className="px-3 py-2 text-center text-sm border-l">
                    <div className="mb-1 text-xs text-gray-600">Total active partners:</div>
                    <div className="flex">
                      <div className="flex-1 px-2">{partnersData.plan}</div>
                      <div className="flex-1 px-2 border-l">{partnersData.fact}</div>
                    </div>
                  </td>
                );
              })}
            </tr>

            {(data.managers || []).map((manager: ManagerData, index: number) => (
              <React.Fragment key={manager.name}>
                <tr className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-4 font-medium text-sm text-gray-900" rowSpan={2}>
                    {manager.name}
                  </td>
                  {visibleMonths.map((month) => {
                    const incomeData = renderCell(manager.income?.[month], 'currency');
                    return (
                      <td key={`${manager.name}-income-${month}`} className="px-3 py-2 text-center text-sm border-l">
                        <div className="mb-1 text-xs text-gray-600">Income:</div>
                        <div className="flex">
                          <div className="flex-1 px-2">{incomeData.plan}</div>
                          <div className="flex-1 px-2 border-l">{incomeData.fact}</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {visibleMonths.map((month) => {
                    const partnersData = renderCell(manager.activePartners?.[month], 'number');
                    return (
                      <td key={`${manager.name}-partners-${month}`} className="px-3 py-2 text-center text-sm border-l">
                        <div className="mb-1 text-xs text-gray-600">Active partners:</div>
                        <div className="flex">
                          <div className="flex-1 px-2">{partnersData.plan}</div>
                          <div className="flex-1 px-2 border-l">{partnersData.fact}</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App; 

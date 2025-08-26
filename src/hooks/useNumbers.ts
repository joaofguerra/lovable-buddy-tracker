import { useState, useEffect } from 'react';
import { PhoneNumber, NumberStats, FilterOptions } from '@/types/number';

const STORAGE_KEY = 'phone-numbers-data';

export function useNumbers() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNumbers(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar no localStorage sempre que numbers mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(numbers));
  }, [numbers]);

  const addNumber = (numberData: Omit<PhoneNumber, 'id' | 'dateConnected'>) => {
    const newNumber: PhoneNumber = {
      ...numberData,
      id: crypto.randomUUID(),
      dateConnected: new Date().toISOString(),
    };
    setNumbers(prev => [...prev, newNumber]);
  };

  const addBulkNumbers = (numbersData: Array<{ number: string; indicator: string; notes?: string }>) => {
    const currentDate = new Date().toISOString();
    const newNumbers: PhoneNumber[] = numbersData.map(data => ({
      ...data,
      id: crypto.randomUUID(),
      dateConnected: currentDate,
      isScammer: false,
    }));
    setNumbers(prev => [...prev, ...newNumbers]);
  };

  const updateNumber = (id: string, updates: Partial<PhoneNumber>) => {
    setNumbers(prev => 
      prev.map(num => 
        num.id === id ? { ...num, ...updates } : num
      )
    );
  };

  const deleteNumber = (id: string) => {
    setNumbers(prev => prev.filter(num => num.id !== id));
  };

  const resetDaysCount = (id: string) => {
    updateNumber(id, { 
      lastReset: new Date().toISOString(),
      dateConnected: new Date().toISOString()
    });
  };

  const getDaysSince = (number: PhoneNumber): number => {
    const referenceDate = number.lastReset || number.dateConnected;
    const now = new Date();
    const connected = new Date(referenceDate);
    const diffTime = Math.abs(now.getTime() - connected.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStats = (): NumberStats => {
    const total = numbers.length;
    const scammers = numbers.filter(n => n.isScammer).length;
    
    const byIndicator: Record<string, { total: number; scammers: number; percentage: number }> = {};
    
    numbers.forEach(num => {
      const indicator = num.indicator;
      if (!byIndicator[indicator]) {
        byIndicator[indicator] = { total: 0, scammers: 0, percentage: 0 };
      }
      byIndicator[indicator].total++;
      if (num.isScammer) {
        byIndicator[indicator].scammers++;
      }
    });

    // Calcular percentuais
    Object.keys(byIndicator).forEach(indicator => {
      const data = byIndicator[indicator];
      data.percentage = data.total > 0 ? (data.scammers / data.total) * 100 : 0;
    });

    return { total, scammers, byIndicator };
  };

  const filterNumbers = (filters: FilterOptions): PhoneNumber[] => {
    return numbers.filter(num => {
      // Filtro de busca
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!num.number.includes(search) && 
            !num.indicator.toLowerCase().includes(search) &&
            !(num.notes?.toLowerCase().includes(search))) {
          return false;
        }
      }

      // Filtro por indicador
      if (filters.indicator && num.indicator !== filters.indicator) {
        return false;
      }

      // Filtro por golpista
      if (filters.isScammer !== 'all') {
        const isScammer = filters.isScammer === 'yes';
        if (num.isScammer !== isScammer) {
          return false;
        }
      }

      // Filtro por data
      if (filters.dateFrom) {
        const numDate = new Date(num.dateConnected);
        const fromDate = new Date(filters.dateFrom);
        if (numDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const numDate = new Date(num.dateConnected);
        const toDate = new Date(filters.dateTo);
        if (numDate > toDate) {
          return false;
        }
      }

      // Filtro por dias desde conexão
      if (filters.daysSince !== null) {
        const days = getDaysSince(num);
        if (days < filters.daysSince) {
          return false;
        }
      }

      return true;
    });
  };

  const exportData = (): string => {
    return JSON.stringify(numbers, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const imported = JSON.parse(jsonData) as PhoneNumber[];
      // Validar estrutura básica
      if (Array.isArray(imported) && imported.every(item => 
        item.id && item.number && item.indicator && item.dateConnected !== undefined
      )) {
        setNumbers(imported);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const getUniqueIndicators = (): string[] => {
    const indicators = numbers.map(n => n.indicator);
    return [...new Set(indicators)].sort();
  };

  return {
    numbers,
    addNumber,
    addBulkNumbers,
    updateNumber,
    deleteNumber,
    resetDaysCount,
    getDaysSince,
    getStats,
    filterNumbers,
    exportData,
    importData,
    getUniqueIndicators,
  };
}
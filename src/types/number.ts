export interface PhoneNumber {
  id: string;
  number: string;
  indicator: string; // Nome ou telefone de quem indicou
  dateConnected: string; // ISO date string
  isScammer: boolean;
  notes?: string;
  lastReset?: string; // ISO date string da última vez que foi resetado
}

export interface NumberStats {
  total: number;
  scammers: number;
  byIndicator: Record<string, {
    total: number;
    scammers: number;
    percentage: number;
  }>;
}

export interface FilterOptions {
  search: string;
  indicator: string;
  isScammer: 'all' | 'yes' | 'no';
  dateFrom: string;
  dateTo: string;
  daysSince: number | null;
}
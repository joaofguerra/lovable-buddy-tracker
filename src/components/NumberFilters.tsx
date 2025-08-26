import { FilterOptions } from '@/types/number';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface NumberFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  indicators: string[];
}

export function NumberFilters({ filters, onFiltersChange, indicators }: NumberFiltersProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      indicator: '',
      isScammer: 'all',
      dateFrom: '',
      dateTo: '',
      daysSince: null,
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.indicator || 
    filters.isScammer !== 'all' || 
    filters.dateFrom || 
    filters.dateTo || 
    filters.daysSince !== null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar número, indicador ou observações..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Indicador */}
          <Select
            value={filters.indicator}
            onValueChange={(value) => updateFilter('indicator', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os indicadores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os indicadores</SelectItem>
              {indicators.map((indicator) => (
                <SelectItem key={indicator} value={indicator}>
                  {indicator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Golpista */}
          <Select
            value={filters.isScammer}
            onValueChange={(value) => updateFilter('isScammer', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="yes">Apenas golpistas</SelectItem>
              <SelectItem value="no">Apenas legítimos</SelectItem>
            </SelectContent>
          </Select>

          {/* Dias mínimos */}
          <Input
            type="number"
            placeholder="Dias mínimos conectado"
            value={filters.daysSince || ''}
            onChange={(e) => updateFilter('daysSince', e.target.value ? parseInt(e.target.value) : null)}
            min="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data inicial */}
          <div>
            <label className="text-sm font-medium mb-1 block">Data inicial:</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
            />
          </div>

          {/* Data final */}
          <div>
            <label className="text-sm font-medium mb-1 block">Data final:</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
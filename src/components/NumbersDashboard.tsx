import { useState } from 'react';
import { useNumbers } from '@/hooks/useNumbers';
import { FilterOptions, PhoneNumber } from '@/types/number';
import { StatsCards } from './StatsCards';
import { NumberFilters } from './NumberFilters';
import { NumberCard } from './NumberCard';
import { AddNumberDialog } from './AddNumberDialog';
import { EditNumberDialog } from './EditNumberDialog';
import { ReportsDialog } from './ReportsDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileDown, FileUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function NumbersDashboard() {
  const {
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
  } = useNumbers();

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    indicator: '',
    isScammer: 'all',
    dateFrom: '',
    dateTo: '',
    daysSince: null,
  });

  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null);
  const { toast } = useToast();

  const filteredNumbers = filterNumbers(filters);
  const stats = getStats();
  const indicators = getUniqueIndicators();

  const handleToggleScammer = (id: string) => {
    const number = numbers.find(n => n.id === id);
    if (number) {
      updateNumber(id, { isScammer: !number.isScammer });
      toast({
        title: number.isScammer ? "Golpe removido" : "Marcado como golpe",
        description: `Número ${number.number} atualizado`,
      });
    }
  };

  const handleReset = (id: string) => {
    resetDaysCount(id);
    toast({
      title: "Contagem resetada",
      description: "A contagem de dias foi reiniciada",
    });
  };

  const handleDelete = (id: string) => {
    const number = numbers.find(n => n.id === id);
    if (number && confirm(`Deseja realmente excluir o número ${number.number}?`)) {
      deleteNumber(id);
      toast({
        title: "Número excluído",
        description: "O número foi removido da lista",
      });
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `numeros-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Dados exportados",
      description: "O arquivo foi baixado com sucesso",
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (importData(content)) {
            toast({
              title: "Dados importados",
              description: "Os números foram carregados com sucesso",
            });
          } else {
            toast({
              title: "Erro na importação",
              description: "Arquivo inválido ou corrompido",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gerenciador de Números</h1>
            <p className="text-muted-foreground">
              Controle e monitore seus números conectados
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AddNumberDialog
              onAddSingle={addNumber}
              onAddBulk={addBulkNumbers}
            />
            <ReportsDialog stats={stats} />
            
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            
            <Button variant="outline" onClick={handleImport} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <NumberFilters
          filters={filters}
          onFiltersChange={setFilters}
          indicators={indicators}
        />

        {/* Numbers Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Números ({filteredNumbers.length})
            </h2>
          </div>
          
          {filteredNumbers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum número encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {numbers.length === 0 
                    ? "Comece adicionando alguns números à sua lista"
                    : "Tente ajustar os filtros para encontrar os números desejados"
                  }
                </p>
                {numbers.length === 0 && (
                  <AddNumberDialog
                    onAddSingle={addNumber}
                    onAddBulk={addBulkNumbers}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNumbers.map((number) => (
                <NumberCard
                  key={number.id}
                  number={number}
                  daysSince={getDaysSince(number)}
                  onToggleScammer={handleToggleScammer}
                  onReset={handleReset}
                  onDelete={handleDelete}
                  onEdit={() => setEditingNumber(number)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <EditNumberDialog
          number={editingNumber}
          open={!!editingNumber}
          onClose={() => setEditingNumber(null)}
          onUpdate={updateNumber}
        />
      </div>
    </div>
  );
}
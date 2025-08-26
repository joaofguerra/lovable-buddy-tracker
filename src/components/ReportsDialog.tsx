import { useState } from 'react';
import { NumberStats } from '@/types/number';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react';

interface ReportsDialogProps {
  stats: NumberStats;
}

export function ReportsDialog({ stats }: ReportsDialogProps) {
  const [open, setOpen] = useState(false);

  const sortedIndicators = Object.entries(stats.byIndicator)
    .sort((a, b) => b[1].percentage - a[1].percentage);

  const bestIndicator = sortedIndicators[0];
  const worstIndicator = sortedIndicators[sortedIndicators.length - 1];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Relatórios
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Relatório de Aproveitamento por Indicador</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumo Geral */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Geral</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total de Números</div>
              </div>
              <div className="text-center p-4 border rounded-lg border-destructive/20 bg-destructive/5">
                <div className="text-2xl font-bold text-destructive">{stats.scammers}</div>
                <div className="text-sm text-muted-foreground">Golpistas</div>
                <div className="text-xs text-destructive">
                  {((stats.scammers / stats.total) * 100).toFixed(1)}% do total
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg border-success/20 bg-success/5">
                <div className="text-2xl font-bold text-success">{stats.total - stats.scammers}</div>
                <div className="text-sm text-muted-foreground">Legítimos</div>
                <div className="text-xs text-success">
                  {(((stats.total - stats.scammers) / stats.total) * 100).toFixed(1)}% do total
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Melhores e Piores */}
          {bestIndicator && worstIndicator && stats.total > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-success/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <TrendingUp className="h-5 w-5" />
                    Melhor Indicador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-semibold">{bestIndicator[0]}</div>
                    <div className="text-sm text-muted-foreground">
                      {bestIndicator[1].scammers} golpistas de {bestIndicator[1].total} números
                    </div>
                    <div className="text-lg font-bold text-success">
                      {(100 - bestIndicator[1].percentage).toFixed(1)}% de aproveitamento
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <TrendingDown className="h-5 w-5" />
                    Pior Indicador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-semibold">{worstIndicator[0]}</div>
                    <div className="text-sm text-muted-foreground">
                      {worstIndicator[1].scammers} golpistas de {worstIndicator[1].total} números
                    </div>
                    <div className="text-lg font-bold text-destructive">
                      {worstIndicator[1].percentage.toFixed(1)}% de golpes
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Detalhamento por Indicador */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Indicador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedIndicators.map(([indicator, data]) => (
                  <div key={indicator} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{indicator}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.scammers}/{data.total} números
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Progress 
                        value={data.percentage} 
                        className="flex-1 h-2"
                      />
                      <div className="text-sm font-medium w-16 text-right">
                        {data.percentage.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                      <div>Total: {data.total}</div>
                      <div className="text-destructive">Golpes: {data.scammers}</div>
                      <div className="text-success">Legítimos: {data.total - data.scammers}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {sortedIndicators.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum indicador encontrado. Adicione alguns números para ver os relatórios.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
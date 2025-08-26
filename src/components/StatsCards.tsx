import { NumberStats } from '@/types/number';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, AlertTriangle, TrendingUp, Users } from 'lucide-react';

interface StatsCardsProps {
  stats: NumberStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const scammerPercentage = stats.total > 0 ? (stats.scammers / stats.total) * 100 : 0;
  const legitimateNumbers = stats.total - stats.scammers;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Números</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            números cadastrados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Golpistas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.scammers}</div>
          <p className="text-xs text-muted-foreground">
            {scammerPercentage.toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Legítimos</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{legitimateNumbers}</div>
          <p className="text-xs text-muted-foreground">
            {(100 - scammerPercentage).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Indicadores</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Object.keys(stats.byIndicator).length}</div>
          <p className="text-xs text-muted-foreground">
            fontes diferentes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
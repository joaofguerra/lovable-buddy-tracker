import { PhoneNumber } from '@/types/number';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RotateCcw, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberCardProps {
  number: PhoneNumber;
  daysSince: number;
  onToggleScammer: (id: string) => void;
  onReset: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export function NumberCard({
  number,
  daysSince,
  onToggleScammer,
  onReset,
  onDelete,
  onEdit,
}: NumberCardProps) {
  const isAlert = daysSince >= 15;
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      number.isScammer && "border-destructive bg-destructive/5",
      isAlert && !number.isScammer && "border-warning bg-warning/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">
            {number.number}
          </CardTitle>
          <div className="flex gap-1">
            {number.isScammer && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Golpista
              </Badge>
            )}
            {isAlert && !number.isScammer && (
              <Badge variant="outline" className="border-warning text-warning">
                15+ dias
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Indicado por:</span>
            <p className="font-medium">{number.indicator}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Dias conectado:</span>
            <p className={cn(
              "font-bold text-lg",
              isAlert && "text-warning",
              number.isScammer && "text-destructive"
            )}>
              {daysSince}
            </p>
          </div>
        </div>
        
        <div>
          <span className="text-muted-foreground text-sm">Conectado em:</span>
          <p className="text-sm">
            {new Date(number.dateConnected).toLocaleDateString('pt-BR')}
          </p>
          {number.lastReset && (
            <p className="text-xs text-muted-foreground">
              Último reset: {new Date(number.lastReset).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
        
        {number.notes && (
          <div>
            <span className="text-muted-foreground text-sm">Observações:</span>
            <p className="text-sm mt-1">{number.notes}</p>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button
            variant={number.isScammer ? "outline" : "destructive"}
            size="sm"
            onClick={() => onToggleScammer(number.id)}
            className="flex-1"
          >
            {number.isScammer ? "Remover Golpe" : "Marcar Golpe"}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onReset(number.id)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(number.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
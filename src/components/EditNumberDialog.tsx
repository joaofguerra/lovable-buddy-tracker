import { useState, useEffect } from 'react';
import { PhoneNumber } from '@/types/number';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface EditNumberDialogProps {
  number: PhoneNumber | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<PhoneNumber>) => void;
}

export function EditNumberDialog({ number, open, onClose, onUpdate }: EditNumberDialogProps) {
  const [form, setForm] = useState({
    number: '',
    indicator: '',
    notes: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (number) {
      setForm({
        number: number.number,
        indicator: number.indicator,
        notes: number.notes || '',
      });
    }
  }, [number]);

  const handleSubmit = () => {
    if (!form.number || !form.indicator) {
      toast({
        title: "Campos obrigatórios",
        description: "Número e indicador são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!number) return;

    onUpdate(number.id, {
      number: form.number,
      indicator: form.indicator,
      notes: form.notes || undefined,
    });

    onClose();
    
    toast({
      title: "Sucesso!",
      description: "Número atualizado com sucesso",
    });
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setForm({ number: '', indicator: '', notes: '' });
  };

  if (!number) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Número</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editNumber">Número *</Label>
              <Input
                id="editNumber"
                value={form.number}
                onChange={(e) => setForm(prev => ({ ...prev, number: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="editIndicator">Indicado por *</Label>
              <Input
                id="editIndicator"
                value={form.indicator}
                onChange={(e) => setForm(prev => ({ ...prev, indicator: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="editNotes">Observações</Label>
            <Textarea
              id="editNotes"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
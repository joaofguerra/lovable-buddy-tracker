import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddNumberDialogProps {
  onAddSingle: (data: { number: string; indicator: string; notes?: string }) => void;
  onAddBulk: (data: Array<{ number: string; indicator: string; notes?: string }>) => void;
}

export function AddNumberDialog({ onAddSingle, onAddBulk }: AddNumberDialogProps) {
  const [open, setOpen] = useState(false);
  const [singleForm, setSingleForm] = useState({ number: '', indicator: '', notes: '' });
  const [bulkText, setBulkText] = useState('');
  const [bulkIndicator, setBulkIndicator] = useState('');
  const { toast } = useToast();

  const handleSingleSubmit = () => {
    if (!singleForm.number || !singleForm.indicator) {
      toast({
        title: "Campos obrigatórios",
        description: "Número e indicador são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onAddSingle({
      number: singleForm.number,
      indicator: singleForm.indicator,
      notes: singleForm.notes || undefined,
    });

    setSingleForm({ number: '', indicator: '', notes: '' });
    setOpen(false);
    
    toast({
      title: "Sucesso!",
      description: "Número adicionado com sucesso",
    });
  };

  const handleBulkSubmit = () => {
    if (!bulkText.trim() || !bulkIndicator.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Lista de números e indicador são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const numbers = bulkText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(number => ({
        number,
        indicator: bulkIndicator,
        notes: undefined,
      }));

    if (numbers.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum número válido encontrado",
        variant: "destructive",
      });
      return;
    }

    onAddBulk(numbers);
    setBulkText('');
    setBulkIndicator('');
    setOpen(false);

    toast({
      title: "Sucesso!",
      description: `${numbers.length} números adicionados com sucesso`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Números
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novos Números</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Número Individual</TabsTrigger>
            <TabsTrigger value="bulk">Lote de Números</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  placeholder="Ex: (11) 99999-9999"
                  value={singleForm.number}
                  onChange={(e) => setSingleForm(prev => ({ ...prev, number: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="indicator">Indicado por *</Label>
                <Input
                  id="indicator"
                  placeholder="Nome ou telefone"
                  value={singleForm.indicator}
                  onChange={(e) => setSingleForm(prev => ({ ...prev, indicator: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações opcionais..."
                value={singleForm.notes}
                onChange={(e) => setSingleForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            
            <Button onClick={handleSingleSubmit} className="w-full">
              Adicionar Número
            </Button>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div>
              <Label htmlFor="bulkIndicator">Indicado por (para todos) *</Label>
              <Input
                id="bulkIndicator"
                placeholder="Nome ou telefone que indicou todos os números"
                value={bulkIndicator}
                onChange={(e) => setBulkIndicator(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="bulkNumbers">Lista de Números *</Label>
              <Textarea
                id="bulkNumbers"
                placeholder="Cole aqui a lista de números, um por linha..."
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={10}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Digite um número por linha. Exemplo:<br/>
                (11) 99999-9999<br/>
                (11) 88888-8888<br/>
                1199999999
              </p>
            </div>
            
            <Button onClick={handleBulkSubmit} className="w-full flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Adicionar {bulkText.split('\n').filter(l => l.trim()).length} Números
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
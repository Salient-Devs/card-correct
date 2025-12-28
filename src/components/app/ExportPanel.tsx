import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CSVProcessingResult, ExportFormat } from '@/types/csv';
import { exportToQuickBooks, exportToXero } from '@/lib/csv-processor';
import { Download, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const exportFormats: ExportFormat[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Compatible with QuickBooks Online and Desktop',
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Standard Xero bank statement format',
  },
];

interface ExportPanelProps {
  result: CSVProcessingResult;
}

export function ExportPanel({ result }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat['id']>('quickbooks');
  const [exported, setExported] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    const content = selectedFormat === 'quickbooks' 
      ? exportToQuickBooks(result)
      : exportToXero(result);
    
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.fileName.replace('.csv', '')}_${selectedFormat}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setExported(true);
    toast({
      title: 'Export complete',
      description: `Your ${selectedFormat === 'quickbooks' ? 'QuickBooks' : 'Xero'} file is ready.`,
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Export Format</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {exportFormats.map((format) => (
          <button
            key={format.id}
            onClick={() => setSelectedFormat(format.id)}
            className={`p-4 rounded-lg border text-left transition-colors ${
              selectedFormat === format.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <p className="font-medium text-foreground">{format.name}</p>
            <p className="text-sm text-muted-foreground">{format.description}</p>
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 mb-4">
        <div>
          <p className="font-medium text-foreground">Ready to export</p>
          <p className="text-sm text-muted-foreground">
            {result.validRows} valid rows will be exported
          </p>
        </div>
        {result.errorRows > 0 && (
          <p className="text-sm text-warning">
            {result.errorRows} rows with errors will be skipped
          </p>
        )}
      </div>
      
      <Button 
        onClick={handleExport} 
        className="w-full" 
        size="lg"
        variant={exported ? 'outline' : 'default'}
      >
        {exported ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4 text-success" />
            Downloaded
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download {selectedFormat === 'quickbooks' ? 'QuickBooks' : 'Xero'} CSV
          </>
        )}
      </Button>
    </div>
  );
}

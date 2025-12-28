import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProcessingHistoryItem } from '@/types/csv';
import { Button } from '@/components/ui/button';
import { History, FileText, Trash2, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ValidationReport } from '@/lib/csv-processor';

interface ProcessingHistoryProps {
  onSelectHistory?: (item: ProcessingHistoryItem) => void;
}

export function ProcessingHistory({ onSelectHistory }: ProcessingHistoryProps) {
  const [history, setHistory] = useState<ProcessingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('processing_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching history:', error);
    } else {
      // Transform the data to match our interface
      const transformedData: ProcessingHistoryItem[] = (data || []).map(item => ({
        id: item.id,
        file_name: item.file_name,
        total_rows: item.total_rows,
        valid_rows: item.valid_rows,
        fixed_rows: item.fixed_rows,
        error_rows: item.error_rows,
        duplicates_found: item.duplicates_found,
        card_provider: item.card_provider,
        export_format: item.export_format,
        processing_time_ms: item.processing_time_ms,
        validation_report: item.validation_report as unknown as ValidationReport | null,
        created_at: item.created_at,
      }));
      setHistory(transformedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('processing_history')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete history item',
        variant: 'destructive',
      });
    } else {
      setHistory(prev => prev.filter(h => h.id !== id));
      toast({
        title: 'Deleted',
        description: 'History item removed',
      });
    }
  };

  const downloadReport = (item: ProcessingHistoryItem) => {
    if (!item.validation_report) return;
    
    const report = item.validation_report;
    const lines: string[] = [
      'CardHub Validation Report',
      `File: ${item.file_name}`,
      `Processed: ${new Date(item.created_at).toISOString()}`,
      `Card Provider: ${item.card_provider || 'Auto-detected'}`,
      '',
      'Summary',
      `Total Rows,${item.total_rows}`,
      `Valid Rows,${item.valid_rows}`,
      `Rows with Fixes,${item.fixed_rows}`,
      `Rows with Errors,${item.error_rows}`,
      `Duplicates Found,${item.duplicates_found}`,
    ];

    if (report.fixes && report.fixes.length > 0) {
      lines.push('');
      lines.push('Fixes Applied');
      lines.push('Row,Field,Type,Original Value,Fixed Value,Rule Applied');
      report.fixes.forEach((fix: { row: number; field: string; type: string; original: string; fixed: string; rule: string }) => {
        lines.push(`${fix.row},"${fix.field}",${fix.type},"${fix.original}","${fix.fixed}","${fix.rule}"`);
      });
    }

    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.file_name.replace('.csv', '')}_report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Processing History</h3>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Processing History</h3>
        </div>
        <p className="text-muted-foreground">No processing history yet. Upload a CSV to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Processing History</h3>
        </div>
      </div>
      
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div key={item.id} className="p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{item.file_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {item.total_rows} rows
                    </Badge>
                    {item.fixed_rows > 0 && (
                      <Badge variant="outline" className="text-xs border-warning text-warning">
                        {item.fixed_rows} fixed
                      </Badge>
                    )}
                    {item.card_provider && (
                      <Badge variant="secondary" className="text-xs">
                        {item.card_provider}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.validation_report && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => downloadReport(item)}
                    title="Download report"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

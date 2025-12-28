import { CSVProcessingResult } from '@/types/csv';
import { Button } from '@/components/ui/button';
import { Download, FileText, ArrowRight } from 'lucide-react';
import { generateValidationReportCSV } from '@/lib/csv-processor';
import { Badge } from '@/components/ui/badge';

interface ValidationReportPanelProps {
  result: CSVProcessingResult;
}

export function ValidationReportPanel({ result }: ValidationReportPanelProps) {
  const report = result.validationReport;
  
  const handleDownloadReport = () => {
    const content = generateValidationReportCSV(result);
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.fileName.replace('.csv', '')}_validation_report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!report) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Validation Report</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadReport}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>
      
      <div className="p-4">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-foreground">{report.totalIssues}</p>
            <p className="text-xs text-muted-foreground">Total Issues</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-success/10">
            <p className="text-2xl font-bold text-success">{report.fixedIssues}</p>
            <p className="text-xs text-muted-foreground">Auto-Fixed</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-destructive/10">
            <p className="text-2xl font-bold text-destructive">{report.errors}</p>
            <p className="text-xs text-muted-foreground">Errors</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-warning/10">
            <p className="text-2xl font-bold text-warning">{report.warnings}</p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </div>
        </div>

        {/* Fixes applied */}
        {report.fixes.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Fixes Applied ({report.fixes.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {report.fixes.slice(0, 20).map((fix, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 text-sm">
                  <Badge variant="outline" className="shrink-0">Row {fix.row}</Badge>
                  <span className="text-muted-foreground shrink-0">{fix.field}</span>
                  <code className="text-destructive/80 line-through text-xs">{fix.original}</code>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <code className="text-success font-medium text-xs">{fix.fixed}</code>
                  <span className="text-xs text-muted-foreground ml-auto hidden md:block">{fix.rule}</span>
                </div>
              ))}
              {report.fixes.length > 20 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  + {report.fixes.length - 20} more fixes (download report for full list)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Errors */}
        {report.errors_list.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Errors ({report.errors_list.length})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {report.errors_list.slice(0, 10).map((err, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-sm">
                  <Badge variant="destructive" className="shrink-0">Row {err.row}</Badge>
                  <span className="text-muted-foreground">{err.field}:</span>
                  <span className="text-destructive">{err.message}</span>
                </div>
              ))}
              {report.errors_list.length > 10 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  + {report.errors_list.length - 10} more errors
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

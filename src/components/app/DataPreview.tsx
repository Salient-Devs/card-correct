import { CSVProcessingResult, CSVRow } from '@/types/csv';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface DataPreviewProps {
  result: CSVProcessingResult;
}

export function DataPreview({ result }: DataPreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(result.rows.length, 50)} of {result.rows.length} rows
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-12">#</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Status</th>
              {result.headers.map((header) => (
                <th key={header} className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {result.rows.slice(0, 50).map((row, index) => (
              <TableRow key={row.id} row={row} headers={result.headers} isDuplicate={result.duplicates.includes(index)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableRow({ row, headers, isDuplicate }: { row: CSVRow; headers: string[]; isDuplicate: boolean }) {
  const hasErrors = row.issues.some(i => i.type === 'error');
  const hasFixes = row.issues.some(i => i.type === 'fixed');
  
  return (
    <tr className={`${hasErrors ? 'bg-destructive/5' : isDuplicate ? 'bg-warning/5' : ''}`}>
      <td className="px-4 py-3 text-muted-foreground">{row.originalIndex}</td>
      <td className="px-4 py-3">
        {hasErrors ? (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        ) : hasFixes ? (
          <Badge variant="outline" className="gap-1 border-warning text-warning">
            <AlertTriangle className="h-3 w-3" />
            Fixed
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 border-success text-success">
            <CheckCircle className="h-3 w-3" />
            Valid
          </Badge>
        )}
      </td>
      {headers.map((header) => {
        const issue = row.issues.find(i => i.field === header);
        const value = row.data[header];
        
        return (
          <td key={header} className="px-4 py-3 whitespace-nowrap">
            {issue ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`cursor-help ${issue.type === 'error' ? 'text-destructive' : issue.type === 'fixed' ? 'text-warning' : ''}`}>
                    {value || '—'}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{issue.message}</p>
                  {issue.originalValue && (
                    <p className="text-xs opacity-80">
                      Original: {issue.originalValue}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="text-foreground">{value || '—'}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

import { CSVProcessingResult } from '@/types/csv';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface ProcessingSummaryProps {
  result: CSVProcessingResult;
}

export function ProcessingSummary({ result }: ProcessingSummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Processing Summary</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {result.processingTime.toFixed(0)}ms
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={CheckCircle2}
          label="Total Rows"
          value={result.totalRows}
          iconColor="text-muted-foreground"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Valid Rows"
          value={result.validRows}
          iconColor="text-success"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Auto-Fixed"
          value={result.fixedRows}
          iconColor="text-warning"
        />
        <SummaryCard
          icon={XCircle}
          label="Errors"
          value={result.errorRows}
          iconColor="text-destructive"
        />
      </div>
      
      {result.duplicates.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-sm text-warning font-medium">
            {result.duplicates.length} potential duplicate row(s) detected
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  iconColor: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-secondary/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

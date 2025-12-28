import { ValidationReport } from '@/lib/csv-processor';

export interface CSVRow {
  id: string;
  originalIndex: number;
  data: Record<string, string>;
  issues: CSVIssue[];
  isValid: boolean;
}

export interface CSVIssue {
  field: string;
  type: 'error' | 'warning' | 'fixed';
  message: string;
  originalValue?: string;
  fixedValue?: string;
}

export interface CSVProcessingResult {
  fileName: string;
  totalRows: number;
  validRows: number;
  fixedRows: number;
  errorRows: number;
  rows: CSVRow[];
  headers: string[];
  duplicates: number[];
  processingTime: number;
  cardProvider?: string;
  validationReport?: ValidationReport;
}

export interface ExportFormat {
  id: 'quickbooks' | 'xero';
  name: string;
  description: string;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export interface ProcessingHistoryItem {
  id: string;
  file_name: string;
  total_rows: number;
  valid_rows: number;
  fixed_rows: number;
  error_rows: number;
  duplicates_found: number;
  card_provider: string | null;
  export_format: string | null;
  processing_time_ms: number | null;
  validation_report: ValidationReport | null;
  created_at: string;
}

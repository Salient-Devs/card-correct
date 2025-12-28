import { CSVRow, CSVIssue, CSVProcessingResult } from '@/types/csv';
import { COMMON_MERCHANT_PATTERNS, detectCardProvider, CardProvider } from './card-providers';

// Date format patterns
const DATE_PATTERNS = [
  { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, format: 'MM/DD/YYYY', parse: (m: string[]) => ({ year: m[3], month: m[1], day: m[2] }) },
  { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, format: 'MM-DD-YYYY', parse: (m: string[]) => ({ year: m[3], month: m[1], day: m[2] }) },
  { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, format: 'YYYY-MM-DD', parse: (m: string[]) => ({ year: m[1], month: m[2], day: m[3] }) },
  { regex: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, format: 'YYYY/MM/DD', parse: (m: string[]) => ({ year: m[1], month: m[2], day: m[3] }) },
  { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, format: 'MM/DD/YY', parse: (m: string[]) => {
    const yr = parseInt(m[3]);
    return { year: (yr > 50 ? '19' : '20') + m[3], month: m[1], day: m[2] };
  }},
  { regex: /^(\d{1,2})-(\d{1,2})-(\d{2})$/, format: 'MM-DD-YY', parse: (m: string[]) => {
    const yr = parseInt(m[3]);
    return { year: (yr > 50 ? '19' : '20') + m[3], month: m[1], day: m[2] };
  }},
  { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, format: 'DD.MM.YYYY', parse: (m: string[]) => ({ year: m[3], month: m[2], day: m[1] }) },
  { regex: /^(\d{4})(\d{2})(\d{2})$/, format: 'YYYYMMDD', parse: (m: string[]) => ({ year: m[1], month: m[2], day: m[3] }) },
];

function normalizeDate(value: string): { normalized: string; wasFixed: boolean; originalFormat?: string } {
  const trimmed = value.trim();
  
  for (const pattern of DATE_PATTERNS) {
    const match = trimmed.match(pattern.regex);
    if (match) {
      const { year, month, day } = pattern.parse(match);
      const normalized = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      return { normalized, wasFixed: normalized !== trimmed, originalFormat: pattern.format };
    }
  }
  
  return { normalized: trimmed, wasFixed: false };
}

function normalizeAmount(value: string): { normalized: string; wasFixed: boolean } {
  const trimmed = value.trim();
  
  // Remove currency symbols and spaces
  let cleaned = trimmed.replace(/[$€£¥₹₽₩,\s]/g, '');
  
  // Handle parentheses for negative numbers
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    cleaned = '-' + cleaned.slice(1, -1);
  }
  
  // Handle European decimal format (comma as decimal separator)
  if (cleaned.match(/^\-?\d+,\d{2}$/)) {
    cleaned = cleaned.replace(',', '.');
  }
  
  // Ensure proper decimal format
  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    const normalized = num.toFixed(2);
    return { normalized, wasFixed: normalized !== trimmed };
  }
  
  return { normalized: trimmed, wasFixed: false };
}

function normalizeMerchant(value: string, providerPatterns: Record<string, string>): { normalized: string; wasFixed: boolean } {
  let trimmed = value.trim();
  
  // Remove extra spaces
  trimmed = trimmed.replace(/\s+/g, ' ');
  
  const upper = trimmed.toUpperCase();
  
  // Check provider-specific patterns first
  for (const [pattern, replacement] of Object.entries(providerPatterns)) {
    if (upper.includes(pattern)) {
      return { normalized: replacement, wasFixed: true };
    }
  }
  
  // Check common patterns
  for (const [pattern, replacement] of Object.entries(COMMON_MERCHANT_PATTERNS)) {
    if (upper.includes(pattern) || upper.startsWith(pattern.replace('*', ''))) {
      return { normalized: replacement, wasFixed: true };
    }
  }
  
  // Title case if all caps
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
    const titleCased = trimmed.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    return { normalized: titleCased, wasFixed: true };
  }
  
  return { normalized: trimmed, wasFixed: false };
}

function detectDuplicates(rows: CSVRow[]): number[] {
  const seen = new Map<string, number>();
  const duplicateIndices: number[] = [];
  
  rows.forEach((row, index) => {
    const key = Object.values(row.data).join('|').toLowerCase();
    if (seen.has(key)) {
      duplicateIndices.push(index);
    } else {
      seen.set(key, index);
    }
  });
  
  return duplicateIndices;
}

function identifyFieldType(header: string, provider: CardProvider): 'date' | 'amount' | 'merchant' | 'category' | 'reference' | 'other' {
  const lower = header.toLowerCase().trim();
  
  if (provider.dateColumns.some(c => c.toLowerCase() === lower)) return 'date';
  if (provider.amountColumns.some(c => c.toLowerCase() === lower)) return 'amount';
  if (provider.merchantColumns.some(c => c.toLowerCase() === lower)) return 'merchant';
  if (provider.categoryColumns.some(c => c.toLowerCase() === lower)) return 'category';
  if (provider.referenceColumns.some(c => c.toLowerCase() === lower)) return 'reference';
  
  // Fallback to generic detection
  if (lower.includes('date') || lower.includes('time')) return 'date';
  if (lower.includes('amount') || lower.includes('total') || lower.includes('price') || lower.includes('debit') || lower.includes('credit')) return 'amount';
  if (lower.includes('merchant') || lower.includes('vendor') || lower.includes('description') || lower.includes('payee')) return 'merchant';
  
  return 'other';
}

export function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));
    
    return values;
  });
  
  return { headers, rows };
}

export interface ValidationReport {
  totalIssues: number;
  fixedIssues: number;
  errors: number;
  warnings: number;
  fixes: Array<{
    row: number;
    field: string;
    type: 'date' | 'amount' | 'merchant' | 'other';
    original: string;
    fixed: string;
    rule: string;
  }>;
  errors_list: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export function processCSV(content: string, fileName: string, providerId?: string): CSVProcessingResult {
  const startTime = performance.now();
  const { headers, rows: rawRows } = parseCSV(content);
  
  // Detect or use specified provider
  const provider = providerId 
    ? (require('./card-providers').getProviderById(providerId) || detectCardProvider(headers))
    : detectCardProvider(headers);
  
  const fieldTypes = headers.map(h => identifyFieldType(h, provider));
  
  const validationReport: ValidationReport = {
    totalIssues: 0,
    fixedIssues: 0,
    errors: 0,
    warnings: 0,
    fixes: [],
    errors_list: [],
  };
  
  const processedRows: CSVRow[] = rawRows.map((row, index) => {
    const issues: CSVIssue[] = [];
    const data: Record<string, string> = {};
    
    headers.forEach((header, colIndex) => {
      const value = row[colIndex] || '';
      const fieldType = fieldTypes[colIndex];
      
      // Check for empty required fields
      if (!value.trim() && (fieldType === 'date' || fieldType === 'amount')) {
        issues.push({
          field: header,
          type: 'error',
          message: `Missing required field: ${header}`,
        });
        validationReport.errors++;
        validationReport.errors_list.push({
          row: index + 1,
          field: header,
          message: `Missing required field`,
        });
        data[header] = value;
        return;
      }
      
      // Process based on field type
      switch (fieldType) {
        case 'date': {
          const { normalized, wasFixed, originalFormat } = normalizeDate(value);
          if (wasFixed) {
            issues.push({
              field: header,
              type: 'fixed',
              message: `Date normalized from ${originalFormat || 'unknown format'}`,
              originalValue: value,
              fixedValue: normalized,
            });
            validationReport.fixedIssues++;
            validationReport.fixes.push({
              row: index + 1,
              field: header,
              type: 'date',
              original: value,
              fixed: normalized,
              rule: `Converted from ${originalFormat || 'unknown'} to ISO format`,
            });
          }
          // Validate the date
          const dateParts = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!dateParts) {
            issues.push({
              field: header,
              type: 'error',
              message: 'Invalid date format',
            });
            validationReport.errors++;
            validationReport.errors_list.push({
              row: index + 1,
              field: header,
              message: 'Invalid date format',
            });
          }
          data[header] = normalized;
          break;
        }
        case 'amount': {
          const { normalized, wasFixed } = normalizeAmount(value);
          if (wasFixed) {
            issues.push({
              field: header,
              type: 'fixed',
              message: 'Amount format normalized',
              originalValue: value,
              fixedValue: normalized,
            });
            validationReport.fixedIssues++;
            validationReport.fixes.push({
              row: index + 1,
              field: header,
              type: 'amount',
              original: value,
              fixed: normalized,
              rule: 'Removed currency symbols, standardized decimals',
            });
          }
          if (isNaN(parseFloat(normalized))) {
            issues.push({
              field: header,
              type: 'error',
              message: 'Invalid amount format',
            });
            validationReport.errors++;
            validationReport.errors_list.push({
              row: index + 1,
              field: header,
              message: 'Invalid amount format',
            });
          }
          data[header] = normalized;
          break;
        }
        case 'merchant': {
          const { normalized, wasFixed } = normalizeMerchant(value, provider.knownMerchantPatterns);
          if (wasFixed) {
            issues.push({
              field: header,
              type: 'fixed',
              message: 'Merchant name cleaned',
              originalValue: value,
              fixedValue: normalized,
            });
            validationReport.fixedIssues++;
            validationReport.fixes.push({
              row: index + 1,
              field: header,
              type: 'merchant',
              original: value,
              fixed: normalized,
              rule: 'Matched known merchant pattern',
            });
          }
          data[header] = normalized;
          break;
        }
        default:
          data[header] = value.trim();
      }
    });
    
    validationReport.totalIssues += issues.length;
    
    return {
      id: `row-${index}`,
      originalIndex: index + 1,
      data,
      issues,
      isValid: !issues.some(i => i.type === 'error'),
    };
  });
  
  const duplicates = detectDuplicates(processedRows);
  
  // Mark duplicates
  duplicates.forEach(index => {
    processedRows[index].issues.push({
      field: 'row',
      type: 'warning',
      message: 'Potential duplicate row detected',
    });
    validationReport.warnings++;
  });
  
  const endTime = performance.now();
  
  return {
    fileName,
    totalRows: processedRows.length,
    validRows: processedRows.filter(r => r.isValid && !duplicates.includes(processedRows.indexOf(r))).length,
    fixedRows: processedRows.filter(r => r.issues.some(i => i.type === 'fixed')).length,
    errorRows: processedRows.filter(r => !r.isValid).length,
    rows: processedRows,
    headers,
    duplicates,
    processingTime: endTime - startTime,
    cardProvider: provider.id,
    validationReport,
  };
}

export function exportToQuickBooks(result: CSVProcessingResult): string {
  const qbHeaders = ['Date', 'Description', 'Amount', 'Account'];
  
  const rows = result.rows
    .filter(row => row.isValid)
    .map(row => {
      const dateEntry = Object.entries(row.data).find(([k]) => 
        k.toLowerCase().includes('date'));
      const merchantEntry = Object.entries(row.data).find(([k]) => 
        k.toLowerCase().includes('description') || k.toLowerCase().includes('merchant') || k.toLowerCase().includes('payee'));
      const amountEntry = Object.entries(row.data).find(([k]) => 
        k.toLowerCase().includes('amount') || k.toLowerCase().includes('debit') || k.toLowerCase().includes('credit'));
      
      return [
        dateEntry?.[1] || '',
        `"${(merchantEntry?.[1] || '').replace(/"/g, '""')}"`,
        amountEntry?.[1] || '',
        'Credit Card'
      ].join(',');
    });
  
  return [qbHeaders.join(','), ...rows].join('\n');
}

export function exportToXero(result: CSVProcessingResult): string {
  const xeroHeaders = ['*Date', '*Amount', 'Description', 'Reference'];
  
  const rows = result.rows
    .filter(row => row.isValid)
    .map(row => {
      const dateEntry = Object.entries(row.data).find(([k]) => 
        k.toLowerCase().includes('date'));
      const merchantEntry = Object.entries(row.data).find(([k]) => 
        k.toLowerCase().includes('description') || k.toLowerCase().includes('merchant') || k.toLowerCase().includes('payee'));
      const amountEntry = Object.entries(row.data).find(([k]) => 
        k.toLowerCase().includes('amount') || k.toLowerCase().includes('debit') || k.toLowerCase().includes('credit'));
      
      return [
        dateEntry?.[1] || '',
        amountEntry?.[1] || '',
        `"${(merchantEntry?.[1] || '').replace(/"/g, '""')}"`,
        ''
      ].join(',');
    });
  
  return [xeroHeaders.join(','), ...rows].join('\n');
}

export function generateValidationReportCSV(result: CSVProcessingResult): string {
  const report = result.validationReport;
  if (!report) return '';
  
  const lines: string[] = [
    'CardHub Validation Report',
    `File: ${result.fileName}`,
    `Processed: ${new Date().toISOString()}`,
    `Card Provider: ${result.cardProvider || 'Auto-detected'}`,
    '',
    'Summary',
    `Total Rows,${result.totalRows}`,
    `Valid Rows,${result.validRows}`,
    `Rows with Fixes,${result.fixedRows}`,
    `Rows with Errors,${result.errorRows}`,
    `Duplicates Found,${result.duplicates.length}`,
    '',
    'Fixes Applied',
    'Row,Field,Type,Original Value,Fixed Value,Rule Applied',
  ];
  
  report.fixes.forEach(fix => {
    lines.push(`${fix.row},"${fix.field}",${fix.type},"${fix.original}","${fix.fixed}","${fix.rule}"`);
  });
  
  lines.push('');
  lines.push('Errors');
  lines.push('Row,Field,Error Message');
  
  report.errors_list.forEach(err => {
    lines.push(`${err.row},"${err.field}","${err.message}"`);
  });
  
  return lines.join('\n');
}

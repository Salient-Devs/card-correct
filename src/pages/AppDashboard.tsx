import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/app/FileUpload';
import { DataPreview } from '@/components/app/DataPreview';
import { ExportPanel } from '@/components/app/ExportPanel';
import { ProcessingSummary } from '@/components/app/ProcessingSummary';
import { ProviderSelect } from '@/components/app/ProviderSelect';
import { ProcessingHistory } from '@/components/app/ProcessingHistory';
import { ValidationReportPanel } from '@/components/app/ValidationReportPanel';
import { UserMenu } from '@/components/app/UserMenu';
import { processCSV } from '@/lib/csv-processor';
import { CSVProcessingResult } from '@/types/csv';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AppDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CSVProcessingResult | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('auto');
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const saveToHistory = async (processingResult: CSVProcessingResult) => {
    if (!user) return;

    try {
      await supabase.from('processing_history').insert([{
        user_id: user.id,
        file_name: processingResult.fileName,
        total_rows: processingResult.totalRows,
        valid_rows: processingResult.validRows,
        fixed_rows: processingResult.fixedRows,
        error_rows: processingResult.errorRows,
        duplicates_found: processingResult.duplicates.length,
        processing_time_ms: processingResult.processingTime,
        card_provider: processingResult.cardProvider || null,
        validation_report: processingResult.validationReport ? JSON.parse(JSON.stringify(processingResult.validationReport)) : null,
      }]);
      setHistoryRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      
      const providerId = selectedProviderId === 'auto' ? undefined : selectedProviderId;
      const processingResult = processCSV(text, file.name, providerId);
      setResult(processingResult);
      await saveToHistory(processingResult);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">CSV Cleaner</h1>
          <UserMenu />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProviderSelect
              value={selectedProviderId}
              onChange={setSelectedProviderId}
            />
            
            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            
            {isProcessing && (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <span className="text-muted-foreground">Processing your file...</span>
              </div>
            )}
            
            {result && !isProcessing && (
              <>
                <ProcessingSummary result={result} />
                <DataPreview result={result} />
                {result.validationReport && (
                  <ValidationReportPanel result={result} />
                )}
              </>
            )}
          </div>
          
          <div className="space-y-6">
            {result && !isProcessing && (
              <ExportPanel result={result} />
            )}
            <ProcessingHistory key={historyRefreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
}

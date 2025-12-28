import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" />
            Trusted by 200+ finance teams
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Fix messy card CSVs
            <br />
            <span className="text-primary">before month-end close</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            CardHub cleans, validates, and normalizes corporate card exports 
            so they import perfectly into QuickBooks or Xero. Every time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/app">
                Upload your CSV free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              No credit card required · 5 files/month free
            </p>
          </div>
        </div>
        
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="relative rounded-xl border border-border bg-card p-2 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-4 text-sm text-muted-foreground">amex_statement_dec2024.csv</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <StatCard label="Rows Processed" value="247" />
                <StatCard label="Issues Fixed" value="18" variant="warning" />
                <StatCard label="Ready to Export" value="245" variant="success" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, variant = 'default' }: { label: string; value: string; variant?: 'default' | 'warning' | 'success' }) {
  const bgClass = variant === 'success' ? 'bg-success/10' : variant === 'warning' ? 'bg-warning/10' : 'bg-secondary';
  const textClass = variant === 'success' ? 'text-success' : variant === 'warning' ? 'text-warning' : 'text-foreground';
  
  return (
    <div className={`rounded-lg ${bgClass} p-4 text-center`}>
      <p className={`text-3xl font-bold ${textClass}`}>{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

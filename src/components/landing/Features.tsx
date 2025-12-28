import { Calendar, DollarSign, Store, Copy, FileCheck, Shield } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Date Normalization',
    description: 'Converts any date format to ISO standard. Handles MM/DD/YY, DD-MM-YYYY, and 20 other formats automatically.',
  },
  {
    icon: DollarSign,
    title: 'Amount Cleanup',
    description: 'Fixes currency symbols, comma decimals, parentheses negatives. Ensures exact 2-decimal precision.',
  },
  {
    icon: Store,
    title: 'Merchant Names',
    description: 'Cleans cryptic card processor codes. "AMZN MKTP US*2X" becomes "Amazon Marketplace".',
  },
  {
    icon: Copy,
    title: 'Duplicate Detection',
    description: 'Identifies and flags potential duplicate transactions before they create reconciliation nightmares.',
  },
  {
    icon: FileCheck,
    title: 'Validation Report',
    description: 'Every fix is logged. Every error is explained. Full audit trail for compliance.',
  },
  {
    icon: Shield,
    title: 'Data Security',
    description: 'Files are processed in-browser. Nothing stored on servers. Deleted after export.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Every CSV problem, fixed automatically
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've seen thousands of broken card exports. CardHub knows exactly how to fix them.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Upload, Cog, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '1',
    title: 'Upload your CSV',
    description: 'Drag and drop your corporate card export. We support Amex, Chase, Capital One, and most major cards.',
  },
  {
    icon: Cog,
    step: '2',
    title: 'Review fixes',
    description: 'See every change highlighted. Dates fixed, amounts normalized, merchants cleaned. Approve or adjust.',
  },
  {
    icon: Download,
    step: '3',
    title: 'Export clean file',
    description: 'Download a perfectly formatted CSV ready for QuickBooks or Xero import. Zero errors guaranteed.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Three steps to clean data
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No training. No setup. Upload and export in under 2 minutes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              <div className="relative mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <step.icon className="h-10 w-10 text-primary" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

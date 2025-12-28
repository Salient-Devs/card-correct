import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for occasional use',
    features: [
      '5 files per month',
      'Up to 500 rows per file',
      'QuickBooks export',
      'Basic validation',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For busy finance teams',
    features: [
      'Unlimited files',
      'Unlimited rows',
      'QuickBooks + Xero export',
      'Advanced merchant cleanup',
      'Duplicate detection',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$99',
    period: '/month',
    description: 'For multi-entity organizations',
    features: [
      'Everything in Pro',
      'Up to 10 users',
      'Custom export templates',
      'Audit log exports',
      'SSO integration',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, predictable pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pay for what you use. No hidden fees. Cancel anytime.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 ${
                plan.highlighted
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-card border border-border'
              }`}
            >
              <h3 className={`text-xl font-semibold mb-2 ${plan.highlighted ? '' : 'text-foreground'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-4 ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {plan.period}
                </span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className={`h-4 w-4 ${plan.highlighted ? '' : 'text-success'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.highlighted ? 'secondary' : 'outline'}
                className="w-full"
                asChild
              >
                <Link to="/app">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

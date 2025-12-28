import { CARD_PROVIDERS } from '@/lib/card-providers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';

interface ProviderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProviderSelect({ value, onChange }: ProviderSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Card Provider (optional)</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Auto-detect provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Auto-detect</span>
            </div>
          </SelectItem>
          {CARD_PROVIDERS.filter(p => p.id !== 'generic').map((provider) => (
            <SelectItem key={provider.id} value={provider.id}>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{provider.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Select your card provider for better merchant name matching
      </p>
    </div>
  );
}

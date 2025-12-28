import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coins, Plus, Loader2, Check } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { email: string };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_inr: number;
  is_active: boolean;
}

export function BuyCreditsDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('is_active', true)
        .order('credits', { ascending: true });
      
      if (error) throw error;
      return data as CreditPackage[];
    },
  });

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (packageData: CreditPackage) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to purchase credits.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(packageData.id);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Session expired');
      }

      const response = await supabase.functions.invoke('create-razorpay-order', {
        body: { packageId: packageData.id },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const orderData = response.data;

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CSV Cleaner',
        description: `${orderData.credits} Credits - ${orderData.packageName}`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyResponse = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                packageId: packageData.id,
              },
            });

            if (verifyResponse.error) {
              throw new Error(verifyResponse.error.message);
            }

            toast({
              title: 'Payment successful!',
              description: `${verifyResponse.data.credits} credits added to your account.`,
            });

            queryClient.invalidateQueries({ queryKey: ['user-credits'] });
            setOpen(false);
          } catch (error) {
            toast({
              title: 'Payment verification failed',
              description: error instanceof Error ? error.message : 'Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: { email: user.email || '' },
        theme: { color: '#10b981' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to initiate payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Buy Credits
          </DialogTitle>
          <DialogDescription>
            Purchase credits to process more CSV files.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {packagesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : packages && packages.length > 0 ? (
            packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => !loading && handlePurchase(pkg)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{pkg.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {pkg.credits} credits
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-foreground">
                      ₹{pkg.price_inr}
                    </span>
                    <Button
                      size="sm"
                      disabled={loading === pkg.id}
                    >
                      {loading === pkg.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No credit packages available.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

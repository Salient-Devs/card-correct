import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Coins } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function CreditsDisplay() {
  const { user } = useAuth();

  const { data: credits, isLoading } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data?.balance ?? 0;
    },
    enabled: !!user,
  });

  if (!user) return null;

  if (isLoading) {
    return <Skeleton className="h-8 w-20" />;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full">
      <Coins className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-foreground">{credits ?? 0} credits</span>
    </div>
  );
}

-- Create user_credits table for tracking credit balance
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit_transactions table for tracking purchases and usage
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
  description TEXT,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit_packages table for available purchase options
CREATE TABLE public.credit_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_inr INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_credits
CREATE POLICY "Users can view their own credits"
ON public.user_credits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits"
ON public.user_credits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON public.user_credits FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for credit_transactions
CREATE POLICY "Users can view their own transactions"
ON public.credit_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.credit_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for credit_packages (public read)
CREATE POLICY "Anyone can view active credit packages"
ON public.credit_packages FOR SELECT
USING (is_active = true);

-- Trigger for updated_at on user_credits
CREATE TRIGGER update_user_credits_updated_at
BEFORE UPDATE ON public.user_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default credit packages
INSERT INTO public.credit_packages (name, credits, price_inr) VALUES
('Starter', 50, 9900),
('Pro', 200, 29900),
('Business', 500, 59900);

-- Function to initialize user credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance)
  VALUES (new.id, 5);
  
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (new.id, 5, 'bonus', 'Welcome bonus credits');
  
  RETURN new;
END;
$$;

-- Trigger to give new users 5 free credits
CREATE TRIGGER on_auth_user_created_credits
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_credits();
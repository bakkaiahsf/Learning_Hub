-- Additional tables for MVP subscription and contact features
-- These are optional - the app will work without them for demo purposes

-- Table: public.email_subscriptions
CREATE TABLE public.email_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    subscribed_at timestamp with time zone DEFAULT now(),
    unsubscribed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: public.contact_submissions
CREATE TABLE public.contact_submissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    company text,
    message text NOT NULL,
    interest text DEFAULT 'general' CHECK (interest IN ('general', 'custom-training', 'enterprise', 'content', 'technical', 'other')),
    status text DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
    submitted_at timestamp with time zone DEFAULT now(),
    responded_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Indexes for better performance
CREATE INDEX idx_email_subscriptions_email ON public.email_subscriptions(email);
CREATE INDEX idx_email_subscriptions_status ON public.email_subscriptions(status);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_interest ON public.contact_submissions(interest);

-- RLS Policies (optional for admin access)
-- ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- If you want to allow public inserts but restrict reads to authenticated users:
-- CREATE POLICY "Allow public subscription inserts" ON public.email_subscriptions FOR INSERT TO anon WITH CHECK (true);
-- CREATE POLICY "Allow public contact form inserts" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);
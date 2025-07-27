-- Create Salesforce News Feed table for auto-refresh dashboard
CREATE TABLE IF NOT EXISTS salesforce_news_feed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    ai_summary TEXT,
    url TEXT NOT NULL,
    published_date TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT,
    source TEXT DEFAULT 'salesforce.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_salesforce_news_created_at ON salesforce_news_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_salesforce_news_published_date ON salesforce_news_feed(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_salesforce_news_category ON salesforce_news_feed(category);

-- Enable Row Level Security
ALTER TABLE salesforce_news_feed ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow read access to news" ON salesforce_news_feed
    FOR SELECT USING (true);

-- Create policy to allow insert/update for service role (for cron jobs)
CREATE POLICY "Allow insert for service role" ON salesforce_news_feed
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for service role" ON salesforce_news_feed
    FOR UPDATE USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_salesforce_news_updated_at
    BEFORE UPDATE ON salesforce_news_feed
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
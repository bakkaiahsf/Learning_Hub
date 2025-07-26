-- Table: public.learning_paths
CREATE TABLE public.learning_paths (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    difficulty text,
    duration text,
    modules_count integer,
    key_skills text[],
    rating numeric,
    image_url text
);

-- Table: public.learning_modules
CREATE TABLE public.learning_modules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id uuid REFERENCES public.learning_paths(id),
    title text NOT NULL,
    content text,
    "order" integer
);

-- Table: public.users
-- Supabase handles user authentication, so this table might be automatically managed or can be extended.
-- For simplicity, we'll assume basic user info here. Supabase Auth will handle the 'id' and 'email'.
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    email text UNIQUE NOT NULL,
    display_name text,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: public.user_progress
CREATE TABLE public.user_progress (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.users(id),
    module_id uuid REFERENCES public.learning_modules(id),
    completed boolean DEFAULT FALSE,
    last_accessed timestamp with time zone DEFAULT now()
);

-- Table: public.search_queries
CREATE TABLE public.search_queries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_text text NOT NULL,
    count integer DEFAULT 1
);



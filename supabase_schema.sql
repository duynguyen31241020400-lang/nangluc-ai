-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Student Profiles
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    persona TEXT DEFAULT 'Minh', -- Default persona from prompt
    current_level INTEGER DEFAULT 1,
    goals JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Competencies (GDPT 2018)
CREATE TABLE competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    grade INTEGER NOT NULL,
    gdpt_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    prerequisites UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Student Knowledge (Knowledge State)
CREATE TABLE student_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    competency_id UUID REFERENCES competencies(id) ON DELETE CASCADE NOT NULL,
    mastery_level FLOAT DEFAULT 0.0 CHECK (mastery_level >= 0.0 AND mastery_level <= 1.0),
    embedding vector(1536), -- For knowledge similarity search
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, competency_id)
);

-- 4. Exercises
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competency_id UUID REFERENCES competencies(id) ON DELETE CASCADE NOT NULL,
    difficulty FLOAT DEFAULT 0.5 CHECK (difficulty >= 0.0 AND difficulty <= 1.0),
    question JSONB NOT NULL, -- Structured question data
    answer JSONB NOT NULL, -- Structured answer data
    hints JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Learning Sessions
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_data JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- 6. Knowledge Base for RAG
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding vector(3072), -- Gemini embedding-004/preview or text-embedding-3
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable full-text search on content
ALTER TABLE knowledge_base ADD COLUMN fts tsvector GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED;
CREATE INDEX knowledge_base_fts_idx ON knowledge_base USING GIN (fts);

-- Hybrid Search Function
CREATE OR REPLACE FUNCTION hybrid_search(
    query_text TEXT,
    query_embedding vector(3072),
    match_threshold FLOAT,
    match_count INT,
    full_text_weight FLOAT DEFAULT 1.0,
    semantic_weight FLOAT DEFAULT 1.0
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.content,
        kb.metadata,
        (
            full_text_weight * ts_rank(kb.fts, plainto_tsquery('simple', query_text)) +
            semantic_weight * (1 - (kb.embedding <=> query_embedding))
        ) AS similarity
    FROM knowledge_base kb
    WHERE
        (1 - (kb.embedding <=> query_embedding)) > match_threshold
        OR kb.fts @@ plainto_tsquery('simple', query_text)
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;

-- Profiles: Users can only read/write their own profile
CREATE POLICY "Users can view own profile" ON student_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON student_profiles FOR UPDATE USING (auth.uid() = id);

-- Knowledge: Users can only read/write their own knowledge state
CREATE POLICY "Users can view own knowledge" ON student_knowledge FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own knowledge" ON student_knowledge FOR ALL USING (auth.uid() = user_id);

-- Competencies & Exercises: Publicly readable
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Competencies are publicly readable" ON competencies FOR SELECT USING (true);
CREATE POLICY "Exercises are publicly readable" ON exercises FOR SELECT USING (true);

-- Lingua Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Languages table
CREATE TABLE languages (
  id TEXT PRIMARY KEY,
  name_ru TEXT NOT NULL,
  name_native TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  is_rtl BOOLEAN DEFAULT FALSE
);

-- Seed languages
INSERT INTO languages (id, name_ru, name_native, accent_color, is_rtl) VALUES
  ('en', 'Английский', 'English', 'english', FALSE),
  ('ar', 'Арабский', 'العربية', 'arabic', TRUE),
  ('fr', 'Французский', 'Français', 'french', FALSE);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  current_language TEXT REFERENCES languages(id),
  current_level TEXT DEFAULT 'starter',
  daily_goal INTEGER DEFAULT 15,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Levels table
CREATE TABLE levels (
  id TEXT PRIMARY KEY,
  language_id TEXT REFERENCES languages(id),
  order_index INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_free BOOLEAN DEFAULT FALSE
);

-- Seed levels for English
INSERT INTO levels (id, language_id, order_index, name, description, is_free) VALUES
  ('en_starter', 'en', 0, 'Starter', 'Нулевой уровень', TRUE),
  ('en_a1', 'en', 1, 'A1', 'Начальный', TRUE),
  ('en_a2', 'en', 2, 'A2', 'Элементарный', FALSE),
  ('en_b1', 'en', 3, 'B1', 'Средний', FALSE),
  ('en_b2', 'en', 4, 'B2', 'Выше среднего', FALSE),
  ('en_c1', 'en', 5, 'C1', 'Продвинутый', FALSE);

-- Modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id TEXT REFERENCES levels(id),
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id),
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  context_text TEXT,
  context_scenario TEXT
);

-- Vocabulary table
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id),
  word TEXT NOT NULL,
  transcription TEXT,
  translation TEXT NOT NULL,
  example_sentence TEXT,
  example_translation TEXT,
  audio_url TEXT,
  word_type TEXT DEFAULT 'word'
);

-- Grammar rules table
CREATE TABLE grammar_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id),
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  examples JSONB DEFAULT '[]'
);

-- Exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id),
  block_type TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  question JSONB NOT NULL,
  correct_answer JSONB NOT NULL,
  options JSONB,
  audio_url TEXT
);

-- User progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- User vocabulary (SRS) table
CREATE TABLE user_vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES vocabulary(id),
  status TEXT DEFAULT 'new',
  ease_factor REAL DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review TIMESTAMPTZ,
  last_reviewed TIMESTAMPTZ,
  UNIQUE(user_id, vocabulary_id)
);

ALTER TABLE user_vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vocabulary" ON user_vocabulary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary" ON user_vocabulary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary" ON user_vocabulary
  FOR UPDATE USING (auth.uid() = user_id);

-- AI conversations table
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  scenario TEXT,
  messages JSONB DEFAULT '[]',
  errors JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_vocabulary_user_id ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_next_review ON user_vocabulary(next_review);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_vocabulary_lesson_id ON vocabulary(lesson_id);
CREATE INDEX idx_exercises_lesson_id ON exercises(lesson_id);

-- Sample data for English A1 Module 1
INSERT INTO modules (id, level_id, order_index, title, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'en_a1', 1, 'Знакомство и базовая речь', 'Приветствия, представление, базовые фразы');

INSERT INTO lessons (id, module_id, order_index, title, context_text, context_scenario) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 1, 'Приветствие и представление',
   'Представь, что ты на международной конференции. Тебе нужно представиться и познакомиться с другими участниками.',
   'Ты на конференции, знакомишься с новыми людьми'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 2, 'Личные местоимения',
   'Чтобы говорить о себе и других, нужно знать местоимения.',
   'Ты описываешь себя и своих коллег'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 3, 'Глагол to be',
   'Глагол to be — один из самых важных в английском языке.',
   'Ты рассказываешь о себе и спрашиваешь о других');

INSERT INTO vocabulary (lesson_id, word, transcription, translation, example_sentence, example_translation, word_type) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 'Hello', '/həˈloʊ/', 'Привет', 'Hello, nice to meet you!', 'Привет, приятно познакомиться!', 'word'),
  ('550e8400-e29b-41d4-a716-446655440002', 'My name is...', '/maɪ neɪm ɪz/', 'Меня зовут...', 'My name is Alex.', 'Меня зовут Алекс.', 'phrase'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Nice to meet you', '/naɪs tuː miːt juː/', 'Приятно познакомиться', 'Nice to meet you too!', 'Мне тоже приятно познакомиться!', 'phrase'),
  ('550e8400-e29b-41d4-a716-446655440004', 'I am', '/aɪ æm/', 'Я есть / Я', 'I am a student.', 'Я студент.', 'phrase'),
  ('550e8400-e29b-41d4-a716-446655440004', 'You are', '/juː ɑːr/', 'Ты есть / Вы есть', 'You are very kind.', 'Ты очень добрый.', 'phrase'),
  ('550e8400-e29b-41d4-a716-446655440004', 'He is / She is', '/hiː ɪz/ /ʃiː ɪz/', 'Он есть / Она есть', 'She is a doctor.', 'Она врач.', 'phrase');

INSERT INTO grammar_rules (lesson_id, title, explanation, examples) VALUES
  ('550e8400-e29b-41d4-a716-446655440004', 'Глагол to be в настоящем времени',
   'Глагол "to be" (быть) — один из самых важных в английском языке. В русском мы часто опускаем его ("Я студент"), но в английском он обязателен ("I am a student"). Используется для описания: кто вы, какой вы, где вы находитесь.',
   '[{"target": "I am happy.", "translation": "Я счастлив."}, {"target": "She is a teacher.", "translation": "Она учитель."}, {"target": "We are at home.", "translation": "Мы дома."}]');

INSERT INTO exercises (lesson_id, block_type, exercise_type, order_index, question, correct_answer, options) VALUES
  ('550e8400-e29b-41d4-a716-446655440004', 'practice', 'choice', 1, '"I ___ a student."', '"am"', '["am", "is", "are", "be"]'),
  ('550e8400-e29b-41d4-a716-446655440004', 'practice', 'choice', 2, '"She ___ from London."', '"is"', '["am", "is", "are", "be"]'),
  ('550e8400-e29b-41d4-a716-446655440004', 'practice', 'fill_blank', 3, '"They ___ my friends."', '"are"', NULL),
  ('550e8400-e29b-41d4-a716-446655440004', 'consolidation', 'translate', 1, '"Я студент."', '"I am a student"', NULL),
  ('550e8400-e29b-41d4-a716-446655440004', 'consolidation', 'translate_reverse', 2, '"We are happy."', '"Мы счастливы"', NULL);

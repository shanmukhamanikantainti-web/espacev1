-- Create custom enum for roles
CREATE TYPE user_role AS ENUM ('Admin', 'Leader', 'Member');

-- 1. Profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'Member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Teams table
CREATE TABLE public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_name TEXT NOT NULL,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 3. Team Members table (Many-to-Many)
CREATE TABLE public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    UNIQUE(team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 4. Projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    project_title TEXT NOT NULL,
    problem_statement TEXT,
    status TEXT DEFAULT 'In Progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5. Milestones table
CREATE TABLE public.milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT FALSE,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- 6. Files table
CREATE TABLE public.files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- 7. GitHub Links table
CREATE TABLE public.github_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    repo_url TEXT NOT NULL,
    commit_count INTEGER DEFAULT 0,
    last_commit_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.github_links ENABLE ROW LEVEL SECURITY;

-- 8. Activity Logs table
CREATE TABLE public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 9. Scores table
CREATE TABLE public.scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    progress_score FLOAT DEFAULT 0,
    admin_score FLOAT DEFAULT 0,
    remarks TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (Simplified for now)
-- 1. Profiles: Users can view all profiles, but only update their own.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Teams: Everyone can see teams, Admins can do everything.
CREATE POLICY "Teams are viewable by everyone." ON public.teams
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage teams." ON public.teams
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

-- 3. Team Members: Everyone can see members, Admins can manage.
CREATE POLICY "Members are viewable by everyone." ON public.team_members
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members." ON public.team_members
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'));

-- 4. Projects: Members can see their project, Admins can see all.
CREATE POLICY "Projects viewable by members and admin." ON public.projects
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM team_members WHERE team_id = projects.team_id AND user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
    );

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 
    CASE 
      WHEN new.email LIKE '%@vishnu.edu.in' THEN 'Member'::user_role
      -- Add admin email check here if needed
      ELSE 'Member'::user_role 
    END);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

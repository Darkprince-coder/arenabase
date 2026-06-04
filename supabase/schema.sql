-- =====================================================
-- ARENABASE — Supabase Database Schema v1.1 (MVP)
-- Updated: Explicit GRANT statements added for all tables
-- to comply with Supabase Data API changes (effective May 30).
-- Run this in: Supabase Dashboard → SQL Editor
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =====================================================
-- SPORTS
-- Foundation for multi-sport expansion.
-- Football seeded at launch; add sports without schema changes.
-- =====================================================
CREATE TABLE sports (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  icon_url    TEXT,
  is_active   BOOLEAN      DEFAULT true,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Seed football as the first sport
INSERT INTO sports (name, slug) VALUES ('Football', 'football');


-- =====================================================
-- VENUES
-- =====================================================
CREATE TABLE venues (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  location    TEXT,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);


-- =====================================================
-- TEAMS
-- =====================================================
CREATE TABLE teams (
  id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name             VARCHAR(200) NOT NULL,
  slug             VARCHAR(200) NOT NULL UNIQUE,
  logo_public_id   TEXT,                                         -- Cloudinary public ID
  sport_id         UUID         REFERENCES sports(id) ON DELETE SET NULL,
  is_active        BOOLEAN      DEFAULT true,
  created_at       TIMESTAMPTZ  DEFAULT NOW()
);


-- =====================================================
-- TOURNAMENTS
-- =====================================================
CREATE TABLE tournaments (
  id                 UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name               VARCHAR(200) NOT NULL,
  slug               VARCHAR(200) NOT NULL UNIQUE,
  sport_id           UUID         REFERENCES sports(id) ON DELETE SET NULL,
  description        TEXT,
  banner_public_id   TEXT,                                       -- Cloudinary public ID
  status             VARCHAR(50)  DEFAULT 'upcoming'
                                  CHECK (status IN ('upcoming','ongoing','completed')),
  format             VARCHAR(50),                                -- 'knockout','league','group_stage','mixed'
  total_teams        INT          DEFAULT 0,
  start_date         DATE,
  end_date           DATE,
  created_at         TIMESTAMPTZ  DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  DEFAULT NOW()
);


-- =====================================================
-- TOURNAMENT TEAMS  (junction)
-- =====================================================
CREATE TABLE tournament_teams (
  tournament_id  UUID  REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id        UUID  REFERENCES teams(id)       ON DELETE CASCADE,
  PRIMARY KEY (tournament_id, team_id)
);


-- =====================================================
-- FIXTURES
-- =====================================================
CREATE TABLE fixtures (
  id             UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id  UUID         REFERENCES tournaments(id) ON DELETE CASCADE,
  home_team_id   UUID         REFERENCES teams(id)       ON DELETE SET NULL,
  away_team_id   UUID         REFERENCES teams(id)       ON DELETE SET NULL,
  venue_id       UUID         REFERENCES venues(id)      ON DELETE SET NULL,
  kickoff_time   TIMESTAMPTZ  NOT NULL,
  round          VARCHAR(100),                                   -- 'Round 1', 'Quarter Finals', 'Final'
  status         VARCHAR(50)  DEFAULT 'scheduled'
                              CHECK (status IN ('scheduled','live','completed','postponed','cancelled')),
  created_at     TIMESTAMPTZ  DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  DEFAULT NOW()
);


-- =====================================================
-- RESULTS
-- One result row per fixture (UNIQUE enforced)
-- =====================================================
CREATE TABLE results (
  id           UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  fixture_id   UUID  REFERENCES fixtures(id) ON DELETE CASCADE UNIQUE,
  home_score   INT   NOT NULL CHECK (home_score >= 0),
  away_score   INT   NOT NULL CHECK (away_score >= 0),
  notes        TEXT,                                             -- e.g. "Won on penalties (5-4)"
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- ANNOUNCEMENTS
-- =====================================================
CREATE TABLE announcements (
  id             UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  title          VARCHAR(300) NOT NULL,
  slug           VARCHAR(300) NOT NULL UNIQUE,
  body           TEXT         NOT NULL,
  tournament_id  UUID         REFERENCES tournaments(id) ON DELETE SET NULL,
  is_published   BOOLEAN      DEFAULT true,
  published_at   TIMESTAMPTZ  DEFAULT NOW(),
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);


-- =====================================================
-- ADMIN USERS
-- MVP: single 'super_admin'. Schema ready for role-based expansion.
-- References Supabase Auth users (auth.users).
-- =====================================================
CREATE TABLE admin_users (
  id             UUID         REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email          VARCHAR(300) NOT NULL UNIQUE,
  full_name      VARCHAR(200),
  role           VARCHAR(50)  DEFAULT 'super_admin'
                              CHECK (role IN ('super_admin','tournament_admin','content_admin')),
  tournament_id  UUID         REFERENCES tournaments(id) ON DELETE SET NULL,
  is_active      BOOLEAN      DEFAULT true,
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);


-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX idx_fixtures_kickoff      ON fixtures(kickoff_time);
CREATE INDEX idx_fixtures_tournament   ON fixtures(tournament_id);
CREATE INDEX idx_fixtures_status       ON fixtures(status);
CREATE INDEX idx_fixtures_home_team    ON fixtures(home_team_id);
CREATE INDEX idx_fixtures_away_team    ON fixtures(away_team_id);
CREATE INDEX idx_results_published     ON results(published_at DESC);
CREATE INDEX idx_announcements_pub     ON announcements(published_at DESC);
CREATE INDEX idx_tournaments_status    ON tournaments(status);
CREATE INDEX idx_tournaments_slug      ON tournaments(slug);
CREATE INDEX idx_teams_slug            ON teams(slug);
CREATE INDEX idx_teams_sport           ON teams(sport_id);


-- =====================================================
-- AUTO-UPDATE updated_at TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_fixtures_updated_at
  BEFORE UPDATE ON fixtures
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_tournaments_updated_at
  BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();


-- =====================================================
-- GRANT PERMISSIONS
-- Required for Supabase Data API (supabase-js / PostgREST).
-- Without these, all queries return empty results or 403 errors
-- on projects created after May 30, 2025.
--
-- Three roles:
--   anon          → unauthenticated public visitors (read-only)
--   authenticated → logged-in admin user (full access)
--   service_role  → server-side admin client (full access, bypasses RLS)
-- =====================================================

-- sports
GRANT SELECT                        ON public.sports TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sports TO service_role;

-- venues
GRANT SELECT                        ON public.venues TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.venues TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.venues TO service_role;

-- teams
GRANT SELECT                        ON public.teams TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO service_role;

-- tournaments
GRANT SELECT                        ON public.tournaments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournaments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournaments TO service_role;

-- tournament_teams
GRANT SELECT                        ON public.tournament_teams TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_teams TO service_role;

-- fixtures
GRANT SELECT                        ON public.fixtures TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fixtures TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fixtures TO service_role;

-- results
GRANT SELECT                        ON public.results TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.results TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.results TO service_role;

-- announcements
GRANT SELECT                        ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO service_role;

-- admin_users (anon gets NO access — intentional)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO service_role;


-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- GRANTs above decide WHICH roles can touch a table.
-- RLS policies below decide WHICH ROWS they can see/modify.
-- Both layers must be correct for the API to work.
-- =====================================================
ALTER TABLE sports           ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues           ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures         ENABLE ROW LEVEL SECURITY;
ALTER TABLE results          ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon can read all public data)
CREATE POLICY "public_read_sports"            ON sports            FOR SELECT USING (true);
CREATE POLICY "public_read_venues"            ON venues            FOR SELECT USING (true);
CREATE POLICY "public_read_active_teams"      ON teams             FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_tournaments"       ON tournaments       FOR SELECT USING (true);
CREATE POLICY "public_read_tournament_teams"  ON tournament_teams  FOR SELECT USING (true);
CREATE POLICY "public_read_fixtures"          ON fixtures          FOR SELECT USING (true);
CREATE POLICY "public_read_results"           ON results           FOR SELECT USING (true);
CREATE POLICY "public_read_announcements"     ON announcements     FOR SELECT USING (is_published = true);

-- Admin full-access policies (authenticated user, i.e. logged-in admin)
CREATE POLICY "admin_all_sports"            ON sports            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_venues"            ON venues            FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_teams"             ON teams             FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_tournaments"       ON tournaments       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_tournament_teams"  ON tournament_teams  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_fixtures"          ON fixtures          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_results"           ON results           FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_announcements"     ON announcements     FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin users: authenticated user can only read/update their own record
CREATE POLICY "admin_read_own_record"
  ON admin_users FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "admin_update_own_record"
  ON admin_users FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- service_role bypasses RLS entirely — no policies needed for it

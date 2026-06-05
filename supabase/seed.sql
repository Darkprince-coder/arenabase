-- =====================================================
-- ARENABASE — Seed Data v1.0
-- Run AFTER schema.sql in: Supabase Dashboard → SQL Editor
-- Safe to re-run: uses ON CONFLICT DO NOTHING on IDs
-- =====================================================

-- ── Venues ───────────────────────────────────────────
INSERT INTO venues (id, name, location) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'CTK ground',        'Kimana'),
  ('a0000000-0000-0000-0000-000000000002', 'Katoo Stadium',         'Kimana'),
  ('a0000000-0000-0000-0000-000000000003', 'Loitoktok stadium',  'Kaloito')
ON CONFLICT (id) DO NOTHING;

-- ── Teams (football) ─────────────────────────────────
INSERT INTO teams (id, name, slug, sport_id, is_active) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Kimana All Stars',           'All-Stars',           (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000002', 'Vikings FC',        'Vikings-fc',        (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000003', 'Liverpool FC',        'Liverpool-FC',        (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000004', 'Kimana Legends FC',          'Legends-fc',          (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000005', 'Home Boys FC',           'Home-Boys',           (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000006', 'Quivers FC',         'Quiversers-fc',         (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000007', 'Bees FC',          'Bees-FC',          (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000008', 'Teachers FC',        'Teachers-FC',        (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000009', 'Young Stars',  'Young-stars',  (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000010', 'Oloile FC',          'Oloile-fc',          (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000011', 'Manyatta FC',       'Manyatta-FC',       (SELECT id FROM sports WHERE slug = 'football'), true),
  ('b0000000-0000-0000-0000-000000000012', 'Osotua FC',         'Osotua-fc',         (SELECT id FROM sports WHERE slug = 'football'), true)
ON CONFLICT (id) DO NOTHING;

-- ── Tournaments ──────────────────────────────────────
INSERT INTO tournaments (id, name, slug, sport_id, description, status, format, total_teams, start_date) VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'Kajiado Super Cup', 'kajiado-super-cup',
    (SELECT id FROM sports WHERE slug = 'football'),
    'The biggest annual knockout tournament in Kajiado bringing together the best teams from across the county.',
    'ongoing', 'knockout', 12,
    (CURRENT_DATE - INTERVAL '10 days')
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'Unity Cup 2024', 'unity-cup-2024',
    (SELECT id FROM sports WHERE slug = 'football'),
    'Uniting communities through the beautiful game.',
    'ongoing', 'group_stage', 8,
    (CURRENT_DATE - INTERVAL '15 days')
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'Community Shield', 'community-shield',
    (SELECT id FROM sports WHERE slug = 'football'),
    'Top teams battle for community bragging rights.',
    'ongoing', 'knockout', 8,
    (CURRENT_DATE - INTERVAL '5 days')
  )
ON CONFLICT (id) DO NOTHING;

-- ── Tournament → Teams ───────────────────────────────
-- Kajiado Super Cup: all 12 teams
INSERT INTO tournament_teams (tournament_id, team_id)
SELECT 'c0000000-0000-0000-0000-000000000001', id FROM teams
ON CONFLICT DO NOTHING;

-- Unity Cup 2024: first 8 teams
INSERT INTO tournament_teams (tournament_id, team_id) VALUES
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- Community Shield: teams 5-12
INSERT INTO tournament_teams (tournament_id, team_id) VALUES
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000006'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000007'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000008'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000009'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000010'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000011'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000012')
ON CONFLICT DO NOTHING;

-- ── Fixtures: UPCOMING (scheduled) ───────────────────
INSERT INTO fixtures (id, tournament_id, home_team_id, away_team_id, venue_id, kickoff_time, round, status) VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',  -- Green FC
    'b0000000-0000-0000-0000-000000000002',  -- Warriors FC
    'a0000000-0000-0000-0000-000000000001',  -- Kajiado Grounds
    (CURRENT_TIMESTAMP + INTERVAL '3 days' - INTERVAL '0 hours' + TIME '15:00:00')::timestamptz,
    'Round of 16', 'scheduled'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000003',  -- Black Stars
    'b0000000-0000-0000-0000-000000000004',  -- Eagles FC
    'a0000000-0000-0000-0000-000000000002',  -- Olkeri Stadium
    (CURRENT_TIMESTAMP + INTERVAL '3 days' + TIME '17:00:00')::timestamptz,
    'Group Stage', 'scheduled'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000005',  -- Unity FC
    'b0000000-0000-0000-0000-000000000006',  -- Rangers FC
    'a0000000-0000-0000-0000-000000000003',  -- Isinya Sports Complex
    (CURRENT_TIMESTAMP + INTERVAL '4 days' + TIME '13:00:00')::timestamptz,
    'Quarter Finals', 'scheduled'
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000007',  -- City Boys
    'b0000000-0000-0000-0000-000000000008',  -- Young Lions
    'a0000000-0000-0000-0000-000000000001',  -- Kajiado Grounds
    (CURRENT_TIMESTAMP + INTERVAL '4 days' + TIME '16:00:00')::timestamptz,
    'Round of 16', 'scheduled'
  ),
  (
    'd0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000009',  -- Kajiado All Stars
    'b0000000-0000-0000-0000-000000000010',  -- Titans FC
    'a0000000-0000-0000-0000-000000000002',  -- Olkeri Stadium
    (CURRENT_TIMESTAMP + INTERVAL '5 days' + TIME '15:00:00')::timestamptz,
    'Group Stage', 'scheduled'
  ),
  (
    'd0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000011',  -- Goal Diggers
    'b0000000-0000-0000-0000-000000000012',  -- Victory FC
    'a0000000-0000-0000-0000-000000000003',  -- Isinya Sports Complex
    (CURRENT_TIMESTAMP + INTERVAL '5 days' + TIME '17:00:00')::timestamptz,
    'Quarter Finals', 'scheduled'
  )
ON CONFLICT (id) DO NOTHING;

-- ── Fixtures: COMPLETED (for results) ────────────────
INSERT INTO fixtures (id, tournament_id, home_team_id, away_team_id, venue_id, kickoff_time, round, status) VALUES
  (
    'd0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',  -- Green FC
    'b0000000-0000-0000-0000-000000000002',  -- Warriors FC
    'a0000000-0000-0000-0000-000000000001',
    (CURRENT_TIMESTAMP - INTERVAL '2 days')::timestamptz,
    'Round of 16', 'completed'
  ),
  (
    'd0000000-0000-0000-0000-000000000008',
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000003',  -- Black Stars
    'b0000000-0000-0000-0000-000000000004',  -- Eagles FC
    'a0000000-0000-0000-0000-000000000002',
    (CURRENT_TIMESTAMP - INTERVAL '2 days')::timestamptz,
    'Group Stage', 'completed'
  ),
  (
    'd0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000005',  -- Unity FC
    'b0000000-0000-0000-0000-000000000006',  -- Rangers FC
    'a0000000-0000-0000-0000-000000000003',
    (CURRENT_TIMESTAMP - INTERVAL '3 days')::timestamptz,
    'Quarter Finals', 'completed'
  ),
  (
    'd0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000007',  -- City Boys
    'b0000000-0000-0000-0000-000000000008',  -- Young Lions
    'a0000000-0000-0000-0000-000000000001',
    (CURRENT_TIMESTAMP - INTERVAL '3 days')::timestamptz,
    'Round of 16', 'completed'
  ),
  (
    'd0000000-0000-0000-0000-000000000011',
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000009',  -- Kajiado All Stars
    'b0000000-0000-0000-0000-000000000010',  -- Titans FC
    'a0000000-0000-0000-0000-000000000002',
    (CURRENT_TIMESTAMP - INTERVAL '4 days')::timestamptz,
    'Group Stage', 'completed'
  )
ON CONFLICT (id) DO NOTHING;

-- ── Results ──────────────────────────────────────────
INSERT INTO results (id, fixture_id, home_score, away_score, published_at) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000007', 2, 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000008', 0, 0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000009', 3, 2, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000010', 1, 1, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000011', 4, 0, CURRENT_TIMESTAMP - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- ── Announcements ────────────────────────────────────
INSERT INTO announcements (id, title, slug, body, tournament_id, is_published, published_at) VALUES
  (
    'f0000000-0000-0000-0000-000000000001',
    'Unity Cup Registration Extended to 30th May',
    'unity-cup-registration-extended-2024',
    'The registration deadline for the Unity Cup 2024 has been extended to 30th May. All teams are encouraged to complete their registration before the deadline. Contact the organizing committee for any queries.',
    'c0000000-0000-0000-0000-000000000002',
    true,
    CURRENT_TIMESTAMP - INTERVAL '1 day'
  ),
  (
    'f0000000-0000-0000-0000-000000000002',
    'Venue Changed for Sunday''s Matches',
    'venue-changed-sundays-matches-2024',
    'Please note that all Sunday matches will now be played at Olkeri Stadium due to maintenance work at the originally scheduled grounds. Updated match cards will be published shortly.',
    NULL,
    true,
    CURRENT_TIMESTAMP - INTERVAL '2 days'
  ),
  (
    'f0000000-0000-0000-0000-000000000003',
    'Kajiado Super Cup Fixtures Released',
    'kajiado-super-cup-fixtures-released-2024',
    'The full fixture list for the Kajiado Super Cup group stage has been released. Check the tournament page for the complete schedule, venues, and kick-off times.',
    'c0000000-0000-0000-0000-000000000001',
    true,
    CURRENT_TIMESTAMP - INTERVAL '3 days'
  ),
  (
    'f0000000-0000-0000-0000-000000000004',
    'Referees Meeting This Saturday',
    'referees-meeting-this-saturday-2024',
    'All registered referees are required to attend the monthly briefing meeting this Saturday at Kajiado Grounds at 9:00 AM. Attendance is mandatory for all officials officiating in upcoming fixtures.',
    NULL,
    true,
    CURRENT_TIMESTAMP - INTERVAL '4 days'
  )
ON CONFLICT (id) DO NOTHING;
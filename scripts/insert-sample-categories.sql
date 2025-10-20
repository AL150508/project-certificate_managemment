-- Insert sample categories into existing certificate_categories table
INSERT INTO certificate_categories (name, description, slug, is_active) VALUES
  ('Achievement', 'Achievement and award certificates', 'achievement', true),
  ('Completion', 'Course completion certificates', 'completion', true),
  ('Participation', 'Event participation certificates', 'participation', true),
  ('Excellence', 'Excellence award certificates', 'excellence', true),
  ('Training', 'Training certificates', 'training', true),
  ('Workshop', 'Workshop completion certificates', 'workshop', true),
  ('Seminar', 'Seminar attendance certificates', 'seminar', true)
ON CONFLICT (name) DO NOTHING;

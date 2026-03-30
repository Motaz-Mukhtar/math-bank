
-- Badges catalog
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏅',
  points_required INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view badges"
ON public.badges FOR SELECT TO authenticated USING (true);

-- Student earned badges
CREATE TABLE public.student_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_profile_id, badge_id)
);

ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view earned badges"
ON public.student_badges FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert earned badges"
ON public.student_badges FOR INSERT TO authenticated
WITH CHECK (student_profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Seed badges
INSERT INTO public.badges (slug, title, description, icon, points_required) VALUES
  ('first-steps', 'الخطوة الأولى', 'أكمل أول اختبار واحصل على نقاطك الأولى', '🌱', 10),
  ('rising-star', 'نجم صاعد', 'وصلت إلى ٥٠ نقطة — أنت في الطريق الصحيح!', '⭐', 50),
  ('century', 'المئوية', 'وصلت إلى ١٠٠ نقطة — إنجاز رائع!', '💯', 100),
  ('math-hero', 'بطل الرياضيات', 'وصلت إلى ٢٥٠ نقطة — أنت بطل حقيقي!', '🦸', 250),
  ('gold-mind', 'العقل الذهبي', 'وصلت إلى ٥٠٠ نقطة — عقل ذهبي!', '🧠', 500),
  ('legend', 'أسطورة الرياضيات', 'وصلت إلى ١٠٠٠ نقطة — أسطورة!', '🏆', 1000);

-- Trigger to auto-award badges on points change
CREATE OR REPLACE FUNCTION public.award_badges_on_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_type != 'student' THEN
    RETURN NEW;
  END IF;

  IF OLD.points IS NOT DISTINCT FROM NEW.points THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.student_badges (student_profile_id, badge_id)
  SELECT NEW.id, b.id
  FROM public.badges b
  WHERE b.points_required IS NOT NULL
    AND b.points_required <= NEW.points
    AND NOT EXISTS (
      SELECT 1 FROM public.student_badges sb
      WHERE sb.student_profile_id = NEW.id AND sb.badge_id = b.id
    );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_award_badges
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.award_badges_on_points();

-- Backfill: award badges to existing students based on current points
INSERT INTO public.student_badges (student_profile_id, badge_id)
SELECT p.id, b.id
FROM public.profiles p
CROSS JOIN public.badges b
WHERE p.user_type = 'student'
  AND b.points_required IS NOT NULL
  AND b.points_required <= p.points
ON CONFLICT DO NOTHING;

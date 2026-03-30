
-- Points history to track student points over time
CREATE TABLE public.points_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points integer NOT NULL,
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view points history (parents need this for linked students)
CREATE POLICY "Authenticated users can view points history"
ON public.points_history
FOR SELECT
TO authenticated
USING (true);

-- Only the student themselves can have points inserted (via system/triggers)
CREATE POLICY "System can insert points history"
ON public.points_history
FOR INSERT
TO authenticated
WITH CHECK (
  student_profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create a trigger to auto-log points changes
CREATE OR REPLACE FUNCTION public.log_points_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.points IS DISTINCT FROM NEW.points THEN
    INSERT INTO public.points_history (student_profile_id, points, reason)
    VALUES (NEW.id, NEW.points, 'تحديث النقاط');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_points_change
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_points_change();

-- Also log initial points on profile creation
CREATE OR REPLACE FUNCTION public.log_initial_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_type = 'student' THEN
    INSERT INTO public.points_history (student_profile_id, points, reason)
    VALUES (NEW.id, NEW.points, 'بداية الحساب');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_initial_points();

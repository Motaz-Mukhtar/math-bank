
-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  student_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can update their notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = parent_id);

-- Function to notify parents when student points change
CREATE OR REPLACE FUNCTION public.notify_parent_on_achievement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _parent record;
  _student_name text;
  _msg text;
BEGIN
  IF OLD.points IS NOT DISTINCT FROM NEW.points THEN
    RETURN NEW;
  END IF;

  _student_name := NEW.full_name;

  IF NEW.points >= 100 AND OLD.points < 100 THEN
    _msg := _student_name || ' وصل إلى ١٠٠ نقطة! 🎉';
  ELSIF NEW.points >= 250 AND OLD.points < 250 THEN
    _msg := _student_name || ' وصل إلى ٢٥٠ نقطة! 🏆';
  ELSIF NEW.points >= 500 AND OLD.points < 500 THEN
    _msg := _student_name || ' وصل إلى ٥٠٠ نقطة! ⭐';
  ELSIF NEW.points > OLD.points AND (NEW.points % 50 = 0) THEN
    _msg := _student_name || ' وصل إلى ' || NEW.points || ' نقطة!';
  ELSE
    RETURN NEW;
  END IF;

  FOR _parent IN
    SELECT parent_id FROM public.parent_student_links
    WHERE student_profile_id = NEW.id
  LOOP
    INSERT INTO public.notifications (parent_id, student_profile_id, message)
    VALUES (_parent.parent_id, NEW.id, _msg);
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_parent_achievement
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.points IS DISTINCT FROM NEW.points)
  EXECUTE FUNCTION public.notify_parent_on_achievement();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

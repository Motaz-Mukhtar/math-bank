CREATE TABLE public.quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic text NOT NULL,
  difficulty text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  points_earned integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can insert their own results"
ON public.quiz_results FOR INSERT TO authenticated
WITH CHECK (student_profile_id IN (
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Authenticated can view quiz results"
ON public.quiz_results FOR SELECT TO authenticated
USING (true);
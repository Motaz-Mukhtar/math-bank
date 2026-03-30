
-- Table to link parents to students
CREATE TABLE public.parent_student_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_profile_id)
);

ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

-- Parents can view their own links
CREATE POLICY "Parents can view their links"
ON public.parent_student_links
FOR SELECT
TO authenticated
USING (auth.uid() = parent_id);

-- Parents can insert links
CREATE POLICY "Parents can insert links"
ON public.parent_student_links
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = parent_id);

-- Parents can delete their links
CREATE POLICY "Parents can delete links"
ON public.parent_student_links
FOR DELETE
TO authenticated
USING (auth.uid() = parent_id);

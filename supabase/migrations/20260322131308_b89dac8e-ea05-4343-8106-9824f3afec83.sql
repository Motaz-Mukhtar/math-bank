CREATE POLICY "Admins can view all links"
ON public.parent_student_links
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
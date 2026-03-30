
-- Add academic_number column to profiles
ALTER TABLE public.profiles ADD COLUMN academic_number TEXT UNIQUE;

-- Create a function to generate a unique 6-digit academic number
CREATE OR REPLACE FUNCTION public.generate_academic_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    new_number := LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE academic_number = new_number) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN new_number;
END;
$$;

-- Update handle_new_user to assign academic_number for students
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_type public.user_type;
  _academic_num TEXT;
BEGIN
  _user_type := COALESCE((NEW.raw_user_meta_data->>'user_type')::public.user_type, 'student');
  
  IF _user_type = 'student' THEN
    _academic_num := public.generate_academic_number();
  ELSE
    _academic_num := NULL;
  END IF;

  INSERT INTO public.profiles (user_id, full_name, user_type, academic_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    _user_type,
    _academic_num
  );
  RETURN NEW;
END;
$$;

-- Backfill existing students that don't have an academic number
UPDATE public.profiles
SET academic_number = public.generate_academic_number()
WHERE user_type = 'student' AND academic_number IS NULL;

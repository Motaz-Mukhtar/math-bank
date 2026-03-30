import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Badge {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  points_required: number | null;
}

interface EarnedBadge extends Badge {
  earned_at: string;
}

export const useStudentBadges = (studentProfileId: string | undefined) => {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentProfileId) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      const [badgesRes, earnedRes] = await Promise.all([
        supabase
          .from("badges" as any)
          .select("id, slug, title, description, icon, points_required")
          .order("points_required", { ascending: true }),
        supabase
          .from("student_badges" as any)
          .select("badge_id, earned_at")
          .eq("student_profile_id", studentProfileId),
      ]);

      const badges = ((badgesRes.data as unknown) as Badge[]) || [];
      const earned = ((earnedRes.data as unknown) as { badge_id: string; earned_at: string }[]) || [];

      setAllBadges(badges);
      setEarnedBadges(
        earned
          .map((e) => {
            const badge = badges.find((b) => b.id === e.badge_id);
            return badge ? { ...badge, earned_at: e.earned_at } : null;
          })
          .filter(Boolean) as EarnedBadge[]
      );
      setLoading(false);
    };

    fetch();
  }, [studentProfileId]);

  return { allBadges, earnedBadges, loading };
};

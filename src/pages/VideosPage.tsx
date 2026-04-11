import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight, BookOpen, CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategories, getCategoriesWithVideos } from "@/services/video.api";
import type { VideoCategory, Video } from "@/services/video.api";
import { toast } from "sonner";

// Helper to extract YouTube ID from URL
const extractYouTubeId = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? match[1] : "";
};

// Color palette for categories
const colors = [
  "gradient-hero",
  "gradient-warm",
  "gradient-accent",
  "gradient-hero",
  "gradient-warm",
  "gradient-accent",
];

const VideosPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesWithVideos();

        setCategories(data);
        // Expand first category by default
        if (data.length > 0) {
          setExpandedUnits(new Set([data[0].categoryId]));
        }
      } catch (error: any) {
        console.error("Failed to fetch categories:", error);
        toast.error(error.response?.data?.error || "فشل تحميل الفيديوهات");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleUnit = (id: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const playVideo = (video: Video) => {
    setActiveVideo(video);
    setWatchedVideos((prev) => new Set(prev).add(video.id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalVideos = categories?.reduce((s, c) => s + (c.videos?.length || 0), 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="font-cairo text-muted-foreground">جاري تحميل الفيديوهات...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary font-cairo font-semibold transition-colors active:scale-95"
            >
              <ArrowRight className="w-5 h-5" />
              الرئيسية
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="font-cairo font-bold text-foreground">الفيديوهات التعليمية</span>
          </div>

          {/* Source badge */}
          <div className="bg-destructive/5 border border-destructive/10 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="text-2xl">📺</span>
            <div>
              <p className="font-cairo font-bold text-foreground text-sm">قناة عين التعليمية — وزارة التعليم 🇸🇦</p>
              <p className="font-cairo text-muted-foreground text-xs">فيديوهات رسمية من المنهج السعودي للصف الثالث الابتدائي</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="font-cairo font-semibold text-foreground text-sm">{categories.length} فصول</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 rounded-xl px-4 py-2">
              <Play className="w-4 h-4 text-secondary" />
              <span className="font-cairo font-semibold text-foreground text-sm">{totalVideos} فيديو</span>
            </div>
            <div className="flex items-center gap-2 bg-[hsl(var(--success))]/10 rounded-xl px-4 py-2">
              <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
              <span className="font-cairo font-semibold text-foreground text-sm">{watchedVideos.size} مُشاهَدة</span>
            </div>
          </div>

          {/* Player */}
          {activeVideo && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg bg-card">
              <div className="aspect-video bg-foreground/5">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(activeVideo.url)}?rel=0`}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5">
                <h2 className="font-cairo font-extrabold text-xl text-foreground mb-1">{activeVideo.title}</h2>
                <p className="text-muted-foreground text-sm font-cairo">{activeVideo.description || "قناة عين التعليمية — وزارة التعليم"}</p>
              </div>
            </div>
          )}

          {/* Units */}
          <div className="space-y-4">
            {categories.map((category, idx) => {
              const isExpanded = expandedUnits.has(category.categoryId);
              const videos = category.videos || [];
              const watched = videos.filter((v) => watchedVideos.has(v.id)).length;
              const color = colors[idx % colors.length];

              return (
                <div key={category.categoryId} className="bg-card rounded-2xl shadow-sm overflow-hidden">
                  {/* Unit header */}
                  <button
                    onClick={() => toggleUnit(category.categoryId)}
                    className="w-full flex items-center gap-4 p-5 text-right hover:bg-muted/30 transition-colors active:scale-[0.99]"
                  >
                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-cairo font-bold text-foreground text-sm md:text-base">{category.categoryName}</h3>
                      <p className="text-muted-foreground text-xs font-cairo truncate">{category.categoryDescription || "فيديوهات تعليمية"}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-cairo text-xs text-muted-foreground hidden sm:block">
                        {watched}/{videos.length}
                      </span>
                      {/* Progress ring */}
                      <svg width="32" height="32" className="hidden sm:block">
                        <circle cx="16" cy="16" r="13" stroke="hsl(var(--border))" strokeWidth="3" fill="none" />
                        <circle
                          cx="16"
                          cy="16"
                          r="13"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${videos.length > 0 ? (watched / videos.length) * 81.68 : 0} 81.68`}
                          strokeLinecap="round"
                          transform="rotate(-90 16 16)"
                          className="transition-all duration-500"
                        />
                      </svg>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Videos list */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      {videos.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                          <p className="font-cairo text-muted-foreground text-sm">لا توجد فيديوهات في هذا الفصل</p>
                        </div>
                      ) : (
                        videos.map((video: Video, videoIdx: number) => {
                          const isActive = activeVideo?.id === video.id;
                          const isWatched = watchedVideos.has(video.id);
                          const youtubeId = extractYouTubeId(video.url);

                          return (
                            <button
                              key={video.id}
                              onClick={() => playVideo(video)}
                              className={`w-full flex items-center gap-4 px-5 py-3.5 text-right transition-colors active:scale-[0.99] ${
                                isActive
                                  ? "bg-primary/5 border-r-4 border-primary"
                                  : "hover:bg-muted/20"
                              } ${videoIdx < videos.length - 1 ? "border-b border-border/50" : ""}`}
                            >
                              {/* YouTube thumbnail */}
                              <div className="w-16 h-10 rounded-lg overflow-hidden bg-muted shrink-0 relative">
                                {youtubeId ? (
                                  <>
                                    <img
                                      src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                                      alt={video.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                      <Play className="w-4 h-4 text-white fill-white" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Play className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-cairo font-semibold text-sm truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                                  {video.title}
                                </p>
                                <p className="text-muted-foreground text-xs font-cairo">{video.description || "عين دروس"}</p>
                              </div>
                              {isWatched ? (
                                <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] shrink-0" />
                              ) : (
                                <Play className="w-5 h-5 text-muted-foreground shrink-0" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VideosPage;

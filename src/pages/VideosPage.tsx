import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight, BookOpen, CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategoriesWithVideos, updateVideoProgress, getAllVideoProgress } from "@/services/video.api";
import type { VideoCategory, Video, VideoProgress } from "@/services/video.api";
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

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideosPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [videoProgress, setVideoProgress] = useState<Map<string, VideoProgress>>(new Map());
  
  // YouTube Player state
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      return;
    }

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

  }, []);

  // Fetch categories and progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, progressData] = await Promise.all([
          getCategoriesWithVideos(),
          getAllVideoProgress(),
        ]);

        setCategories(categoriesData);
        
        // Convert progress array to map for quick lookup
        const progressMap = new Map<string, VideoProgress>();
        progressData.forEach(p => progressMap.set(p.videoId, p));
        setVideoProgress(progressMap);

        // Expand first category by default
        if (categoriesData.length > 0) {
          setExpandedUnits(new Set([categoriesData[0].categoryId]));
        }
      } catch (error: any) {
        console.error("Failed to fetch data:", error);
        toast.error(error.response?.data?.error || "فشل تحميل الفيديوهات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize YouTube Player when active video changes
  useEffect(() => {
    if (!activeVideo || !window.YT || !window.YT.Player) {
      return;
    }

    // Destroy existing player
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    // Clear existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    setIsPlayerReady(false);

    // Create new player
    const youtubeId = extractYouTubeId(activeVideo.url);
    if (!youtubeId) {
      toast.error("رابط الفيديو غير صحيح");
      return;
    }

    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: youtubeId,
      playerVars: {
        rel: 0, // Don't show related videos
        modestbranding: 1, // Minimal YouTube branding
        fs: 1, // Allow fullscreen
        cc_load_policy: 0, // Don't show captions by default
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [activeVideo]);

  const onPlayerReady = (event: any) => {
    setIsPlayerReady(true);
  };

  const onPlayerStateChange = (event: any) => {
    const playerState = event.data;
    
    // YT.PlayerState.PLAYING = 1
    if (playerState === 1) {
      // Only start tracking if video is not already completed
      if (!activeVideo || !videoProgress.get(activeVideo.id)?.isCompleted) {
        startProgressTracking();
      }
    } 
    // YT.PlayerState.PAUSED = 2 or ENDED = 0
    else if (playerState === 2 || playerState === 0) {
      stopProgressTracking();
      
      // If video ended, update progress one final time (only if not completed)
      if (playerState === 0 && activeVideo && !videoProgress.get(activeVideo.id)?.isCompleted) {
        updateProgress();
      }
    }
  };

  const startProgressTracking = () => {
    // Don't track progress for already completed videos
    if (activeVideo && videoProgress.get(activeVideo.id)?.isCompleted) return;

    // Clear existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Update progress every 20 seconds while playing
    progressIntervalRef.current = setInterval(() => {
      updateProgress();
    }, 20000);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const updateProgress = async () => {
    if (!playerRef.current || !activeVideo) return;

    // Don't update progress for already completed videos
    const currentProgress = videoProgress.get(activeVideo.id);
    if (currentProgress?.isCompleted) {
      stopProgressTracking();
      return;
    }

    try {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();

      if (!duration || duration === 0) return;

      // Check if user is going backward - don't update if current time is less than stored progress
      if (currentProgress && currentProgress.watchedDuration > 0) {
        if (currentTime < currentProgress.watchedDuration) return;
      }

      const progressPercent = Math.min(Math.round((currentTime / duration) * 100), 100);

      // Update backend
      const updatedProgress = await updateVideoProgress(activeVideo.id, {
        watchedDuration: Math.round(currentTime),
        totalDuration: Math.round(duration),
        progressPercent,
      });

      // Update the current watched duration
      currentProgress.watchedDuration = updatedProgress.watchedDuration;

      // Update local state
      setVideoProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(activeVideo.id, updatedProgress);
        return newMap;
      });

      // Show completion toast and stop tracking
      if (updatedProgress.isCompleted && !currentProgress?.isCompleted) {
        toast.success("🎉 أحسنت! أكملت الدرس بنجاح");
        stopProgressTracking(); // Stop tracking once completed
      }
    } catch (error: any) {
      console.error('Failed to update progress:', error);
      // Don't show error toast to avoid annoying user
    }
  };

  const toggleUnit = (id: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const playVideo = (video: Video) => {
    setActiveVideo(video);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalVideos = categories?.reduce((s, c) => s + (c.videos?.length || 0), 0);
  const completedCount = Array.from(videoProgress.values()).filter(p => p.isCompleted).length;

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
              <span className="font-cairo font-semibold text-foreground text-sm">{completedCount} مُكتمل</span>
            </div>
          </div>

          {/* Player */}
          {activeVideo && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg bg-card">
              <div className="aspect-video bg-foreground/5 relative">
                <div id="youtube-player" className="w-full h-full"></div>
                {!isPlayerReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="font-cairo font-extrabold text-xl text-foreground flex-1">{activeVideo.title}</h2>
                  {videoProgress.get(activeVideo.id)?.isCompleted && (
                    <div className="flex items-center gap-1.5 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] px-3 py-1.5 rounded-lg shrink-0">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-cairo font-bold text-xs">مُكتمل</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm font-cairo mb-3">
                  {activeVideo.description || "قناة عين التعليمية — وزارة التعليم"}
                </p>
                
                {/* Progress bar */}
                {videoProgress.get(activeVideo.id) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-cairo">
                      <span className="text-muted-foreground">التقدم</span>
                      <span className="font-bold text-primary">
                        {videoProgress.get(activeVideo.id)!.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${videoProgress.get(activeVideo.id)!.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Units */}
          <div className="space-y-4">
            {categories.map((category, idx) => {
              const isExpanded = expandedUnits.has(category.id);
              const videos = category.videos || [];
              const completed = videos.filter((v) => videoProgress.get(v.id)?.isCompleted).length;
              const color = colors[idx % colors.length];

              return (
                <div key={category.id} className="bg-card rounded-2xl shadow-sm overflow-hidden">
                  {/* Unit header */}
                  <button
                    onClick={() => toggleUnit(category.id)}
                    className="w-full flex items-center gap-4 p-5 text-right hover:bg-muted/30 transition-colors active:scale-[0.99]"
                  >
                    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-cairo font-bold text-foreground text-sm md:text-base">{category.name}</h3>
                      <p className="text-muted-foreground text-xs font-cairo truncate">
                        {category.description || "فيديوهات تعليمية"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-cairo text-xs text-muted-foreground hidden sm:block">
                        {completed}/{videos.length}
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
                          strokeDasharray={`${videos.length > 0 ? (completed / videos.length) * 81.68 : 0} 81.68`}
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
                          const progress = videoProgress.get(video.id);
                          const isCompleted = progress?.isCompleted || false;
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
                                <div className="flex items-center gap-2">
                                  <p className="text-muted-foreground text-xs font-cairo">
                                    {video.description || "عين دروس"}
                                  </p>
                                  {progress && progress.progressPercent > 0 && progress.progressPercent < 90 && (
                                    <span className="text-xs font-cairo text-primary font-bold">
                                      {progress.progressPercent}%
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isCompleted ? (
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

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Video, FolderOpen, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  createVideoCategory, 
  createVideo, 
  getCategories,
  type VideoCategory 
} from "@/services/video.api";
import { QuestionFormContainer } from "@/components/admin/QuestionFormContainer";
import { QuestionList } from "@/components/admin/QuestionList";

const AdminContentManager = () => {
  // Ref for scrolling to form
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Video categories list
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Question management state
  const [editingQuestionId, setEditingQuestionId] = useState<string | undefined>();
  const [refreshQuestionList, setRefreshQuestionList] = useState(0);

  // Video Category state
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categorySortOrder, setCategorySortOrder] = useState("0");
  const [savingCategory, setSavingCategory] = useState(false);

  // Video state
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCategory, setVideoCategory] = useState<string>("");
  const [videoSortOrder, setVideoSortOrder] = useState("0");
  const [savingVideo, setSavingVideo] = useState(false);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleQuestionSuccess = () => {
    setEditingQuestionId(undefined);
    setRefreshQuestionList(prev => prev + 1);
  };

  const handleQuestionEdit = (questionId: string) => {
    setEditingQuestionId(questionId);
    
    // Scroll to the form after a short delay to ensure state is updated
    setTimeout(() => {
      formContainerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleQuestionCancel = () => {
    setEditingQuestionId(undefined);
  };

  const handleAddVideoCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("اسم الفصل مطلوب");
      return;
    }

    const sortOrder = parseInt(categorySortOrder);
    if (isNaN(sortOrder)) {
      toast.error("ترتيب العرض يجب أن يكون رقم");
      return;
    }

    setSavingCategory(true);
    try {
      await createVideoCategory({
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
        sortOrder,
      });

      toast.success("تم إضافة الفصل بنجاح");
      
      // Reset form
      setCategoryName("");
      setCategoryDescription("");
      setCategorySortOrder("0");

      // Refresh categories list
      await fetchCategories();
    } catch (error: any) {
      console.error("Failed to create video category:", error);
      toast.error(error.response?.data?.error || "حدث خطأ أثناء إضافة الفصل");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleAddVideo = async () => {
    if (!videoTitle.trim()) {
      toast.error("عنوان الفيديو مطلوب");
      return;
    }

    if (!videoUrl.trim()) {
      toast.error("رابط الفيديو مطلوب");
      return;
    }

    if (!videoCategory) {
      toast.error("الفصل مطلوب");
      return;
    }

    const sortOrder = parseInt(videoSortOrder);
    if (isNaN(sortOrder)) {
      toast.error("ترتيب العرض يجب أن يكون رقم");
      return;
    }

    setSavingVideo(true);
    try {
      await createVideo({
        title: videoTitle.trim(),
        description: videoDescription.trim() || undefined,
        url: videoUrl.trim(),
        categoryId: videoCategory,
        sortOrder,
      });

      toast.success("تم إضافة الفيديو بنجاح");
      
      // Reset form
      setVideoTitle("");
      setVideoDescription("");
      setVideoUrl("");
      setVideoCategory("");
      setVideoSortOrder("0");
    } catch (error: any) {
      console.error("Failed to create video:", error);
      toast.error(error.response?.data?.error || "حدث خطأ أثناء إضافة الفيديو");
    } finally {
      setSavingVideo(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          إدارة المحتوى
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="question" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-3 font-cairo">
            <TabsTrigger value="question" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              إدارة الأسئلة
            </TabsTrigger>
            <TabsTrigger value="category" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              إضافة فصل
            </TabsTrigger>
            <TabsTrigger value="video" className="gap-2">
              <Video className="w-4 h-4" />
              إضافة فيديو
            </TabsTrigger>
          </TabsList>

          {/* Add Question Tab */}
          <TabsContent value="question" className="space-y-4 mt-4">
            <div ref={formContainerRef}>
              <QuestionFormContainer
                questionId={editingQuestionId}
                onSuccess={handleQuestionSuccess}
                onCancel={editingQuestionId ? handleQuestionCancel : undefined}
              />
            </div>
            
            <div className="pt-6 border-t">
              <QuestionList
                key={refreshQuestionList}
                onEdit={handleQuestionEdit}
              />
            </div>
          </TabsContent>

          {/* Add Video Category Tab */}
          <TabsContent value="category" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="font-cairo font-semibold">اسم الفصل</Label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="مثال: الجمع والطرح"
                className="font-cairo"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-cairo font-semibold">
                الوصف <span className="text-muted-foreground">(اختياري)</span>
              </Label>
              <Textarea
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="وصف مختصر عن محتوى الفصل..."
                className="font-cairo min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-cairo font-semibold">ترتيب العرض</Label>
              <Input
                type="number"
                min="0"
                value={categorySortOrder}
                onChange={(e) => setCategorySortOrder(e.target.value)}
                className="font-cairo"
              />
              <p className="text-xs text-muted-foreground">الأرقام الأصغر تظهر أولاً</p>
            </div>

            <Button
              onClick={handleAddVideoCategory}
              disabled={savingCategory}
              className="w-full gap-2 font-cairo font-bold active:scale-[0.97]"
            >
              {savingCategory ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {savingCategory ? "جاري الإضافة..." : "إضافة الفصل"}
            </Button>
          </TabsContent>

          {/* Add Video Tab */}
          <TabsContent value="video" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="font-cairo font-semibold">عنوان الفيديو</Label>
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="مثال: مقدمة في الجمع"
                className="font-cairo"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-cairo font-semibold">
                الوصف <span className="text-muted-foreground">(اختياري)</span>
              </Label>
              <Textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="وصف مختصر عن محتوى الفيديو..."
                className="font-cairo min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-cairo font-semibold">رابط الفيديو</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="font-cairo"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-cairo font-semibold">الفصل</Label>
              <Select value={videoCategory} onValueChange={setVideoCategory}>
                <SelectTrigger className="font-cairo">
                  <SelectValue placeholder="اختر الفصل" />
                </SelectTrigger>
                <SelectContent className="font-cairo">
                  {loadingCategories ? (
                    <SelectItem value="loading" disabled>
                      جاري التحميل...
                    </SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      لا توجد فصول - أضف فصل أولاً
                    </SelectItem>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {categories.length === 0 && !loadingCategories && (
                <p className="text-xs text-muted-foreground">
                  يجب إضافة فصل أولاً من تبويب "إضافة فصل"
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-cairo font-semibold">ترتيب العرض</Label>
              <Input
                type="number"
                min="0"
                value={videoSortOrder}
                onChange={(e) => setVideoSortOrder(e.target.value)}
                className="font-cairo"
              />
              <p className="text-xs text-muted-foreground">الأرقام الأصغر تظهر أولاً</p>
            </div>

            <Button
              onClick={async () => {
                if (!videoTitle.trim()) {
                  toast.error("عنوان الفيديو مطلوب");
                  return;
                }
                if (!videoUrl.trim()) {
                  toast.error("رابط الفيديو مطلوب");
                  return;
                }
                if (!videoCategory) {
                  toast.error("الفصل مطلوب");
                  return;
                }

                const sortOrder = parseInt(videoSortOrder);
                if (isNaN(sortOrder)) {
                  toast.error("ترتيب العرض يجب أن يكون رقم");
                  return;
                }

                setSavingVideo(true);
                try {
                  await createVideo({
                    title: videoTitle.trim(),
                    description: videoDescription.trim() || undefined,
                    url: videoUrl.trim(),
                    categoryId: videoCategory,
                    sortOrder,
                  });

                  toast.success("تم إضافة الفيديو بنجاح");
                  
                  // Reset form
                  setVideoTitle("");
                  setVideoDescription("");
                  setVideoUrl("");
                  setVideoCategory("");
                  setVideoSortOrder("0");
                } catch (error: any) {
                  console.error("Failed to create video:", error);
                  toast.error(error.response?.data?.error || "حدث خطأ أثناء إضافة الفيديو");
                } finally {
                  setSavingVideo(false);
                }
              }}
              disabled={savingVideo}
              className="w-full gap-2 font-cairo font-bold active:scale-[0.97]"
            >
              {savingVideo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {savingVideo ? "جاري الإضافة..." : "إضافة الفيديو"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminContentManager;

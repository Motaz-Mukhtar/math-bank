import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Pencil, Trash2, Video, ExternalLink, MoveRight, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  getVideos,
  getAllCategoriesNoPagination,
  createVideo,
  updateVideo,
  deleteVideo,
  moveVideo,
  type Video as VideoType,
  type VideoCategory,
  type PaginationMeta,
} from "@/services/video.api";

export const VideoManagement = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); // The search term being used in API
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<VideoType | null>(null);
  const [movingVideo, setMovingVideo] = useState<VideoType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editSortOrder, setEditSortOrder] = useState("");

  // Move form state
  const [moveTargetCategoryId, setMoveTargetCategoryId] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [currentPage, categoryFilter, activeSearch]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategoriesNoPagination();
      setCategories(categoriesData.categories);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      toast.error("فشل تحميل الفصول");
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getVideos(
        currentPage,
        10,
        categoryFilter !== "ALL" ? categoryFilter : undefined,
        activeSearch || undefined
      );
      console.log("Videos");
      console.log(response);
      setVideos(response.videos);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Failed to fetch videos:", error);
      toast.error("فشل تحميل الفيديوهات");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId);
    if (category) return category.name;
    
    // Fallback to video's embedded category if categories not loaded yet
    const video = videos.find((v) => v.categoryId === categoryId);
    return video?.category?.name || "غير معروف";
  };

  const handleSearch = () => {
    setActiveSearch(searchQuery.trim());
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // No need for client-side filtering anymore - backend handles it
  const filteredVideos = videos;
  const displayCount = pagination.total;

  const handleEdit = (video: VideoType) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description || "");
    setEditUrl(video.url);
    setEditCategoryId(video.categoryId);
    setEditSortOrder(video.sortOrder.toString());
  };

  const handleCreate = () => {
    if (categories.length === 0) {
      toast.error("يجب إضافة فصل واحد على الأقل أولاً");
      return;
    }
    setIsCreating(true);
    setEditTitle("");
    setEditDescription("");
    setEditUrl("");
    setEditCategoryId(categories[0]?.id || "");
    setEditSortOrder("1");
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("عنوان الفيديو مطلوب");
      return;
    }

    if (!editUrl.trim()) {
      toast.error("رابط الفيديو مطلوب");
      return;
    }

    if (!editCategoryId) {
      toast.error("يجب اختيار الفصل");
      return;
    }

    const sortOrder = parseInt(editSortOrder);
    if (isNaN(sortOrder)) {
      toast.error("ترتيب العرض يجب أن يكون رقم");
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        await createVideo({
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          url: editUrl.trim(),
          categoryId: editCategoryId,
          sortOrder,
        });
        toast.success("تم إضافة الفيديو بنجاح");
        setIsCreating(false);
      } else if (editingVideo) {
        await updateVideo(editingVideo.id, {
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          url: editUrl.trim(),
          categoryId: editCategoryId,
          sortOrder,
        });
        toast.success("تم تحديث الفيديو بنجاح");
        setEditingVideo(null);
      }
      await fetchVideos();
    } catch (error: any) {
      console.error("Failed to save video:", error);
      toast.error(error.response?.data?.error || "فشل حفظ الفيديو");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setEditingVideo(null);
    setIsCreating(false);
  };

  const handleDelete = async () => {
    if (!deletingVideo) return;

    setSaving(true);
    try {
      await deleteVideo(deletingVideo.id);
      toast.success("تم حذف الفيديو بنجاح");
      setDeletingVideo(null);
      await fetchVideos();
    } catch (error: any) {
      console.error("Failed to delete video:", error);
      toast.error(error.response?.data?.error || "فشل حذف الفيديو");
    } finally {
      setSaving(false);
    }
  };

  const handleMove = (video: VideoType) => {
    setMovingVideo(video);
    setMoveTargetCategoryId(video.categoryId);
  };

  const handleSaveMove = async () => {
    if (!movingVideo) return;

    if (!moveTargetCategoryId) {
      toast.error("يجب اختيار الفصل المستهدف");
      return;
    }

    if (moveTargetCategoryId === movingVideo.categoryId) {
      toast.error("الفيديو موجود بالفعل في هذا الفصل");
      return;
    }

    setSaving(true);
    try {
      await moveVideo(movingVideo.id, moveTargetCategoryId);
      toast.success("تم نقل الفيديو بنجاح");
      setMovingVideo(null);
      await fetchVideos();
    } catch (error: any) {
      console.error("Failed to move video:", error);
      toast.error(error.response?.data?.error || "فشل نقل الفيديو");
    } finally {
      setSaving(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                إدارة الفيديوهات ({displayCount})
              </CardTitle>
              <Button onClick={handleCreate} className="gap-2 font-cairo">
                <Plus className="w-4 h-4" />
                إضافة فيديو
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالعنوان أو الوصف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pr-10 font-cairo text-sm h-9"
                />
              </div>
              <Button
                onClick={handleSearch}
                variant="secondary"
                className="gap-2 font-cairo h-9"
                disabled={loading}
              >
                <Search className="w-4 h-4" />
                بحث
              </Button>
              {activeSearch && (
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="font-cairo h-9"
                  disabled={loading}
                >
                  مسح البحث
                </Button>
              )}
              <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                <SelectTrigger className="w-48 font-cairo text-sm h-9">
                  <SelectValue placeholder="جميع الفصول" />
                </SelectTrigger>
                <SelectContent className="font-cairo">
                  <SelectItem value="ALL">جميع الفصول</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVideos?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {activeSearch || categoryFilter !== "ALL" ? "لا توجد نتائج للبحث" : "لا توجد فيديوهات"}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right font-cairo">العنوان</TableHead>
                      <TableHead className="text-right font-cairo">الفصل</TableHead>
                      <TableHead className="text-right font-cairo">الترتيب</TableHead>
                      <TableHead className="text-right font-cairo">الرابط</TableHead>
                      <TableHead className="text-right font-cairo">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVideos?.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium font-cairo">
                          {video.title}
                        </TableCell>
                        <TableCell className="font-cairo">
                          {getCategoryName(video.categoryId)}
                        </TableCell>
                        <TableCell className="font-cairo">{video.sortOrder}</TableCell>
                        <TableCell>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            فتح
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(video)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMove(video)}
                              className="h-8 w-8 p-0"
                            >
                              <MoveRight className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingVideo(video)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground font-cairo">
                    صفحة {pagination.page} من {pagination.totalPages} — {pagination.total} فيديو
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="gap-1 font-cairo"
                    >
                      <ChevronRight className="w-4 h-4" />
                      السابق
                    </Button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="gap-1 font-cairo"
                    >
                      التالي
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={!!editingVideo || isCreating} onOpenChange={handleCloseDialog}>
        <DialogContent className="font-cairo" dir="rtl">
          <DialogHeader>
            <DialogTitle>{isCreating ? "إضافة فيديو جديد" : "تعديل الفيديو"}</DialogTitle>
            <DialogDescription>
              {isCreating ? "أدخل معلومات الفيديو الجديد" : "قم بتعديل معلومات الفيديو"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان الفيديو</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="عنوان الفيديو"
              />
            </div>

            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="وصف الفيديو (اختياري)"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>رابط الفيديو</Label>
              <Input
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="https://..."
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>الفصل</Label>
              <Select value={editCategoryId} onValueChange={setEditCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفصل" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ترتيب العرض</Label>
              <Input
                type="number"
                min="0"
                value={editSortOrder}
                onChange={(e) => setEditSortOrder(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isCreating ? (
                "إضافة الفيديو"
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={!!movingVideo} onOpenChange={() => setMovingVideo(null)}>
        <DialogContent className="font-cairo" dir="rtl">
          <DialogHeader>
            <DialogTitle>نقل الفيديو</DialogTitle>
            <DialogDescription>
              اختر الفصل الذي تريد نقل الفيديو إليه
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>الفصل الحالي</Label>
              <Input
                value={movingVideo ? getCategoryName(movingVideo.categoryId) : ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>الفصل الجديد</Label>
              <Select
                value={moveTargetCategoryId}
                onValueChange={setMoveTargetCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفصل" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMovingVideo(null)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button onClick={handleSaveMove} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "نقل الفيديو"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingVideo} onOpenChange={() => setDeletingVideo(null)}>
        <DialogContent className="font-cairo" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف الفيديو</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>

          {deletingVideo && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">{deletingVideo.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                الفصل: {getCategoryName(deletingVideo.categoryId)}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingVideo(null)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "حذف"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

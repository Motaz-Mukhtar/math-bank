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
import { Loader2, Pencil, Trash2, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import {
  getCategories,
  updateVideoCategory,
  deleteVideoCategory,
  type VideoCategory,
} from "@/services/video.api";

export const CategoryManagement = () => {
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<VideoCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<VideoCategory | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSortOrder, setEditSortOrder] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      toast.error("فشل تحميل الفصول");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: VideoCategory) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || "");
    setEditSortOrder(category.sortOrder.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    if (!editName.trim()) {
      toast.error("اسم الفصل مطلوب");
      return;
    }

    const sortOrder = parseInt(editSortOrder);
    if (isNaN(sortOrder)) {
      toast.error("ترتيب العرض يجب أن يكون رقم");
      return;
    }

    setSaving(true);
    try {
      await updateVideoCategory(editingCategory.id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        sortOrder,
      });

      toast.success("تم تحديث الفصل بنجاح");
      setEditingCategory(null);
      await fetchCategories();
    } catch (error: any) {
      console.error("Failed to update category:", error);
      toast.error(error.response?.data?.error || "فشل تحديث الفصل");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    setSaving(true);
    try {
      await deleteVideoCategory(deletingCategory.id);
      toast.success("تم حذف الفصل بنجاح");
      setDeletingCategory(null);
      await fetchCategories();
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      toast.error(error.response?.data?.error || "فشل حذف الفصل");
    } finally {
      setSaving(false);
    }
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
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            إدارة الفصول ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد فصول
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right font-cairo">الاسم</TableHead>
                    <TableHead className="text-right font-cairo">الوصف</TableHead>
                    <TableHead className="text-right font-cairo">الترتيب</TableHead>
                    <TableHead className="text-right font-cairo">عدد الفيديوهات</TableHead>
                    <TableHead className="text-right font-cairo">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium font-cairo">
                        {category.name}
                      </TableCell>
                      <TableCell className="font-cairo text-muted-foreground">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell className="font-cairo">{category.sortOrder}</TableCell>
                      <TableCell className="font-cairo">
                        {category.videos?.length || 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingCategory(category)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            disabled={(category.videos?.length || 0) > 0}
                            title={
                              (category.videos?.length || 0) > 0
                                ? "لا يمكن حذف فصل يحتوي على فيديوهات"
                                : "حذف الفصل"
                            }
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
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="font-cairo" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل الفصل</DialogTitle>
            <DialogDescription>
              قم بتعديل معلومات الفصل
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم الفصل</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="اسم الفصل"
              />
            </div>

            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="وصف الفصل (اختياري)"
                className="min-h-[80px]"
              />
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
              onClick={() => setEditingCategory(null)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <DialogContent className="font-cairo" dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف الفصل</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الفصل؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>

          {deletingCategory && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">{deletingCategory.name}</p>
              {deletingCategory.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {deletingCategory.description}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
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

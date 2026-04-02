import { useState } from "react";
import { updateUser, type UserWithPoints } from "@/services/admin.api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

interface AdminEditUserDialogProps {
  user: UserWithPoints | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminEditUserDialog = ({ user, onClose, onSuccess }: AdminEditUserDialogProps) => {
  const [editName, setEditName] = useState(user?.fullName ?? "");
  const [editPoints, setEditPoints] = useState(String(user?.points ?? 0));
  const [saving, setSaving] = useState(false);

  // Sync when user prop changes
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleSave = async () => {
    if (!user || !editName.trim()) return;
    setSaving(true);
    try {
      await updateUser(user.id, {
        fullName: editName.trim(),
        points: user.role === "STUDENT" ? parseInt(editPoints) || 0 : undefined,
      });
      toast.success("تم تحديث البيانات بنجاح");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "حدث خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={handleOpenChange}>
      <DialogContent className="font-cairo" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-cairo text-lg">تعديل بيانات الحساب</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="font-cairo font-semibold">الاسم الكامل</Label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="font-cairo"
              maxLength={100}
            />
          </div>
          {user?.role === "STUDENT" && (
            <div className="space-y-2">
              <Label className="font-cairo font-semibold">النقاط</Label>
              <Input
                type="number"
                min={0}
                value={editPoints}
                onChange={(e) => setEditPoints(e.target.value)}
                className="font-cairo tabular-nums"
                dir="ltr"
              />
            </div>
          )}
          <div className="rounded-xl bg-muted/50 p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">نوع الحساب</span>
              <span className="font-bold">{user?.role === "STUDENT" ? "طالب" : "ولي أمر"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">البريد الإلكتروني</span>
              <span className="font-bold text-xs" dir="ltr">{user?.email}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" className="font-cairo">إلغاء</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={saving || !editName.trim()}
            className="gap-2 font-cairo font-bold active:scale-[0.97]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditUserDialog;

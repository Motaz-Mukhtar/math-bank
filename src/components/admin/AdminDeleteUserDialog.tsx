import { useState } from "react";
import { deleteUser, type UserWithPoints } from "@/services/admin.api";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AdminDeleteUserDialogProps {
  user: UserWithPoints | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminDeleteUserDialog = ({ user, onClose, onSuccess }: AdminDeleteUserDialogProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteUser(user.id);
      toast.success(`تم حذف حساب "${user.fullName}" بنجاح`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "حدث خطأ أثناء الحذف");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="font-cairo" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cairo text-lg">تأكيد حذف الحساب</AlertDialogTitle>
          <AlertDialogDescription className="font-cairo text-right leading-relaxed">
            هل أنت متأكد من حذف حساب{" "}
            <strong className="text-foreground">"{user?.fullName}"</strong>؟
            <br />
            سيتم حذف جميع بيانات المستخدم نهائياً ولا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="font-cairo">إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2 font-cairo font-bold"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {deleting ? "جاري الحذف..." : "حذف نهائياً"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminDeleteUserDialog;

import { useState, useEffect, useCallback } from "react";
import { getUsers, type UserWithPoints } from "@/services/admin.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Database, Star, Loader2, Pencil, Trash2,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const USERS_PER_PAGE = 10;

export interface AdminUsersTableProps {
  currentUserId?: string;
  onEdit: (u: UserWithPoints) => void;
  onDelete: (u: UserWithPoints) => void;
}

const AdminUsersTable = ({ currentUserId, onEdit, onDelete }: AdminUsersTableProps) => {
  const [users, setUsers] = useState<UserWithPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "STUDENT" | "PARENT">("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async (p: number, s: string, r: string) => {
    try {
      setLoading(true);
      const data = await getUsers({
        page: p,
        limit: USERS_PER_PAGE,
        search: s.trim() || undefined,
        role: r === "ALL" ? undefined : (r as "STUDENT" | "PARENT"),
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "فشل تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(1, "", "ALL"); }, [fetchUsers]);

  // Listen for external refresh events (after edit/delete)
  useEffect(() => {
    const handler = () => fetchUsers(page, search, roleFilter);
    window.addEventListener("admin:refresh-users", handler);
    return () => window.removeEventListener("admin:refresh-users", handler);
  }, [page, search, roleFilter, fetchUsers]);

  const handleSearch = () => { setPage(1); fetchUsers(1, search, roleFilter); };
  const handleRoleChange = (val: string) => {
    const r = val as "ALL" | "STUDENT" | "PARENT";
    setRoleFilter(r); setPage(1); fetchUsers(1, search, r);
  };
  const handlePageChange = (p: number) => { setPage(p); fetchUsers(p, search, roleFilter); };

  return (
    <Card className="shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            جميع الحسابات المسجلة
            {!loading && (
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {total}
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Select value={roleFilter} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-36 font-cairo text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-cairo">
                <SelectItem value="ALL">الكل</SelectItem>
                <SelectItem value="STUDENT">طلاب</SelectItem>
                <SelectItem value="PARENT">أولياء أمور</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البريد..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pr-10 font-cairo text-sm w-52 h-9"
              />
            </div>
            <Button size="sm" variant="outline" onClick={handleSearch} className="font-cairo h-9">
              بحث
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-cairo text-right">الاسم</TableHead>
                    <TableHead className="font-cairo text-right">النوع</TableHead>
                    <TableHead className="font-cairo text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="font-cairo text-right">الرقم الأكاديمي</TableHead>
                    <TableHead className="font-cairo text-right">النقاط</TableHead>
                    <TableHead className="font-cairo text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="font-cairo text-right w-24">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u, idx) => (
                    <TableRow
                      key={u.id}
                      className="hover:bg-muted/30 transition-colors animate-in fade-in"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <TableCell className="font-cairo font-semibold">
                        {u.fullName || "بدون اسم"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 text-xs font-cairo font-bold px-2.5 py-1 rounded-full ${
                          u.role === "STUDENT"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary/10 text-secondary"
                        }`}>
                          {u.role === "STUDENT" ? "طالب" : "ولي أمر"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground" dir="ltr">
                        {u.email}
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {(u as any).academicNumber || "—"}
                      </TableCell>
                      <TableCell>
                        {u.role === "STUDENT" ? (
                          <span className="flex items-center gap-1 text-primary font-bold tabular-nums">
                            <Star className="w-3.5 h-3.5" />{u.points || 0}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(u.createdAt).toLocaleDateString("ar-SA")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(u)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors active:scale-95"
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {u.id !== currentUserId && (
                            <button
                              onClick={() => onDelete(u)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors active:scale-95"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-10 font-cairo">
                        لا توجد نتائج
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground font-cairo">
                  صفحة {page} من {totalPages} — {total} حساب
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="gap-1 font-cairo"
                  >
                    <ChevronRight className="w-4 h-4" />السابق
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-cairo font-bold transition-colors ${
                            p === page
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="gap-1 font-cairo"
                  >
                    التالي<ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsersTable;

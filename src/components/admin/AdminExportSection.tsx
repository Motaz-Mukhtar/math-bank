import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminExportSectionProps {
  onExport: () => void;
}

const AdminExportSection = ({ onExport }: AdminExportSectionProps) => (
  <Card className="shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <Download className="w-5 h-5 text-primary" />
        استخراج التقارير
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Button onClick={onExport} className="gap-2 font-cairo font-bold active:scale-[0.97]">
        <Download className="w-4 h-4" />
        تصدير جميع المستخدمين (CSV)
      </Button>
    </CardContent>
  </Card>
);

export default AdminExportSection;

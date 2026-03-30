import { Calculator } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground py-10">
    <div className="container text-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-primary-foreground">
        <Calculator className="w-6 h-6" />
        <span className="font-cairo font-extrabold text-xl">بنك الرياضيات</span>
      </div>
      <p className="text-primary-foreground/60 font-cairo text-sm">
        منصة تعليمية تفاعلية لطلاب الصف الثالث الابتدائي
      </p>
      <p className="text-primary-foreground/50 font-cairo text-xs">
        مبادرة من روضة وابتدائية ومتوسطة تحفيظ القرآن بالعيدابي — الأستاذة إيمان طميحي | مديرة المدرسة ليلى حسن
      </p>
      <p className="text-primary-foreground/40 font-cairo text-xs">
        © {new Date().getFullYear()} بنك الرياضيات — جميع الحقوق محفوظة
      </p>
    </div>
  </footer>
);

export default Footer;

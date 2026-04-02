import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Calculator, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationsBell from "@/components/NotificationsBell";

const scrollToLeaderboard = () => {
  setTimeout(() => {
    document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" });
  }, 80);
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLeaderboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") {
      scrollToLeaderboard();
    } else {
      navigate("/");
      scrollToLeaderboard();
    }
  };

  const links = [
    { label: "الرئيسية",    href: "/",            isLeaderboard: false },
    { label: "الفيديوهات",  href: "/videos",       isLeaderboard: false },
    { label: "الاختبارات",  href: "/quizzes",      isLeaderboard: false },
    { label: "العجلة",      href: "/wheel",        isLeaderboard: false },
    { label: "الترتيب",     href: "/#leaderboard", isLeaderboard: true  },
    ...(user?.role === "PARENT" ? [{ label: "لوحة التحكم",  href: "/parent-dashboard", isLeaderboard: false }] : []),
    ...(user?.role === "ADMIN"  ? [{ label: "إدارة النظام", href: "/admin",             isLeaderboard: false }] : []),
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary font-cairo font-extrabold text-xl">
          <Calculator className="w-7 h-7" />
          <span>بنك الرياضيات</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              {l.isLeaderboard ? (
                <a
                  href={l.href}
                  onClick={handleLeaderboardClick}
                  className="text-foreground/70 hover:text-primary font-cairo font-semibold transition-colors duration-200"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  to={l.href}
                  className="text-foreground/70 hover:text-primary font-cairo font-semibold transition-colors duration-200"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <NotificationsBell />
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-primary/5 rounded-full px-4 py-1.5 hover:bg-primary/10 transition-colors"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="font-cairo font-semibold text-foreground text-sm">
                  {user.fullName || "مستخدم"}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="text-muted-foreground hover:text-destructive transition-colors p-2 active:scale-95"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-foreground/70 hover:text-primary font-cairo font-semibold transition-colors"
              >
                دخول
              </Link>
              <Link
                to="/signup"
                className="gradient-hero text-primary-foreground font-cairo font-bold px-5 py-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow active:scale-[0.97]"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-2 active:scale-95"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-b border-border px-6 pb-4 space-y-3">
          {links.map((l) =>
            l.isLeaderboard ? (
              <a
                key={l.href}
                href={l.href}
                onClick={handleLeaderboardClick}
                className="block text-foreground/80 hover:text-primary font-cairo font-semibold py-1"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="block text-foreground/80 hover:text-primary font-cairo font-semibold py-1"
              >
                {l.label}
              </Link>
            )
          )}

          {user ? (
            <>
              <div className="flex items-center gap-2 py-1">
                <User className="w-4 h-4 text-primary" />
                <span className="font-cairo font-semibold text-foreground text-sm">
                  {user.fullName || "مستخدم"}
                </span>
              </div>
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="block w-full text-center bg-destructive/10 text-destructive font-cairo font-bold py-2 rounded-xl"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block text-center border-2 border-primary text-primary font-cairo font-bold py-2 rounded-full"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block text-center gradient-hero text-primary-foreground font-cairo font-bold py-2 rounded-full"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

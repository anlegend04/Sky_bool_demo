import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Plus,
  Briefcase,
  Users,
  Calendar,
  Mail,
  BarChart3,
  MessageSquare,
  Home,
  Menu,
  X,
  Languages,
} from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/hooks/use-language";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add error boundary for useLanguage hook
  let languageContext;
  try {
    languageContext = useLanguage();
  } catch (error) {
    // Fallback if LanguageProvider is not available
    languageContext = {
      t: (key: string, fallback?: string) => fallback || key,
      currentLanguage: "en" as const,
      setLanguage: () => {},
      getCurrentLanguageInfo: () => ({
        code: "en",
        name: "English",
        nativeName: "English",
        flag: "🇺🇸",
      }),
    };
  }

  const { t, currentLanguage, setLanguage, getCurrentLanguageInfo } =
    languageContext;

  const navItems = [
    {
      name: t("nav.dashboard"),
      path: "/",
      icon: Home,
    },
    {
      name: t("nav.jobs"),
      path: "/jobs",
      icon: Briefcase,
    },
    {
      name: t("nav.candidates"),
      path: "/candidates",
      icon: Users,
    },
    {
      name: t("nav.calendar"),
      path: "/calendar",
      icon: Calendar,
    },
    {
      name: t("nav.email"),
      path: "/email-automation",
      icon: Mail,
    },
    {
      name: t("nav.reports"),
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: t("nav.notifications"),
      path: "/notifications",
      icon: MessageSquare,
    },
    {
      name: t("nav.settings"),
      path: "/settings",
      icon: Settings,
    },
  ];

  const quickActions = [
    {
      name: t("header.addJob"),
      path: "/jobs/create",
      icon: Briefcase,
    },
    {
      name: t("header.addCandidate"),
      path: "/candidates/create",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="text-2xl font-bold text-primary">
                  {t("company.name")}
                </div>
                <div className="hidden sm:block ml-3 text-sm text-gray-600">
                  {t("company.tagline")}
                </div>
              </div>
            </div>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder={t("header.search")} className="pl-10" />
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-3">
              {/* Quick Add dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("header.quickAdd")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {quickActions.map((action) => (
                    <Link key={action.path} to={action.path}>
                      <DropdownMenuItem>
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.name}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Languages className="w-5 h-5" />
                    <span className="hidden sm:inline ml-2 text-sm">
                      {getCurrentLanguageInfo().flag}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => setLanguage(language.code)}
                      className={
                        currentLanguage === language.code ? "bg-accent" : ""
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <span>{language.flag}</span>
                        <span>{language.nativeName}</span>
                        <span className="text-sm text-muted-foreground">
                          ({language.name})
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      {t("nav.settings")}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder={t("header.search")} className="pl-10" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out`}
        >
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-primary-foreground" : "text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

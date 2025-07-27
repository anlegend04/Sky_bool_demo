import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUnreadNotificationCount } from "@/data/hardcoded-data";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Users,
  Briefcase,
  Calendar,
  Mail,
  BarChart3,
  Settings,
  Home,
  Plus,
  Search,
  Bell,
  User,
  UserCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Email Automation", href: "/email", icon: Mail },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Update notification count
  useEffect(() => {
    const updateNotificationCount = () => {
      const count = getUnreadNotificationCount();
      setUnreadCount(count);
    };

    updateNotificationCount();
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleQuickAddJob = () => {
    // In a real app, this would open the Add Job dialog
    toast({
      title: "Quick Add",
      description: "Add Job dialog would open here.",
    });
    window.location.href = "/jobs";
  };

  const handleQuickAddCandidate = () => {
    // In a real app, this would open the Add Candidate dialog
    toast({
      title: "Quick Add",
      description: "Add Candidate dialog would open here.",
    });
    window.location.href = "/candidates";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2 icon-mobile"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">TD</span>
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className="text-xl font-bold text-primary">TD CONSULTING</div>
                  <div className="text-xs text-secondary font-medium -mt-1">Trusted Recruitment Partner</div>
                </div>
              </div>
            </div>

            {/* Search - Hidden on mobile, shown in header on larger screens */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search candidates, jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-wrap-safe"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden icon-mobile"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Quick Add Dropdown - Hidden on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 hidden sm:flex btn-mobile">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden lg:inline text-wrap-safe">Quick Add</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dropdown-mobile">
                  <DropdownMenuItem onClick={handleQuickAddJob} className="text-wrap-safe">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Add Job
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleQuickAddCandidate} className="text-wrap-safe">
                    <Users className="w-4 h-4 mr-2" />
                    Add Candidate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Link to="/notifications">
                <Button variant="ghost" size="sm" className="relative icon-mobile">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 flex items-center justify-center badge-mobile">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 dropdown-mobile">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 min-w-0 flex-1">
                      <p className="text-sm font-medium text-wrap-safe">John Doe</p>
                      <p className="text-xs text-slate-500 text-wrap-safe truncate">
                        john.doe@company.com
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-wrap-safe">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <Link to="/settings">
                    <DropdownMenuItem className="text-wrap-safe">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/notifications">
                    <DropdownMenuItem className="text-wrap-safe">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 text-wrap-safe">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search candidates, jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-wrap-safe"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </div>
        )}

        {/* Sidebar */}
        <nav
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 nav-mobile",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200 lg:hidden">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HR</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-slate-900 text-wrap-safe">
                TalentFlow
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="icon-mobile"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "nav-item-mobile text-wrap-safe",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="text-wrap-safe">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Quick Actions */}
            <div className="mt-6 pt-6 border-t border-slate-200 lg:hidden">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-wrap-safe">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-wrap-safe"
                  onClick={handleQuickAddJob}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-wrap-safe"
                  onClick={handleQuickAddCandidate}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}

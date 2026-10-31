"use client";

import type React from "react";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  FolderKanban,
  PlusCircle,
  Settings,
  Moon,
  Sun,
  Menu,
  Users,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/lib/auth-client";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/app/lib/server-config";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(true);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderKanban,
      current: pathname === "/projects",
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      current: pathname === "/tasks",
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      current: pathname === "/documents",
    },
    {
      name: "Team Members",
      href: "/employees",
      icon: Users,
      current: pathname === "/employees",
    },
    {
      name: "New Project",
      href: "/new-project",
      icon: PlusCircle,
      current: pathname === "/new-project",
    },
  ];

  useEffect(() => {
    setName(localStorage.getItem("adminName") || "");
    setEmail(localStorage.getItem("adminEmail") || "");
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const adminId = localStorage.getItem("adminId");
        if (!adminId) {
          router.push("/");
          return;
        }

        const response = await fetch(`${API_URL}/admins/${adminId}`, {
          method: "GET",
          headers: {
            "x-api-key": "thisisasdca",
            "Content-Type": "application/json",
            Authorization: `Authorization ${localStorage.getItem(
              "accessToken"
            )}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setUserData(result.data);

          // Check if user has no subscription or plan
          if (!result.data.subscription || !result.data.subscription.plan) {
            setHasSubscription(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("adminId")) {
      fetchUserData();
    }
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    router.push("/");
    toast({
      title: "Signed out successfully",
      description: "You have been signed out successfully.",
      duration: 3000,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation with glassmorphism effect */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200 supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/80 dark:border-slate-800 dark:supports-[backdrop-filter]:bg-slate-950/20">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2 px-2">
                  <span className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                    Taskpilot Labs
                  </span>
                </div>
                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                        item.current
                          ? "bg-slate-800 text-white dark:bg-slate-700"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 md:hidden">
            <span className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Taskpilot Labs
            </span>
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            <span className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Taskpilot Labs
            </span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {/* Subscription Button - Show if no subscription */}
            {(!userData?.subscription || !userData?.subscription?.plan) && (
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push("/subscribe")}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                Choose a Plan
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleSignOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Adding a spacer to account for the fixed header */}
      <div className="h-16"></div>

      {/* Sidebar and main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar navigation - already fixed */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 bg-background border-r">
          <div className="flex flex-col gap-1 p-4 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? "bg-slate-800 text-white dark:bg-slate-700"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <div className="mt-auto pt-4 space-y-4">
              

              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-slate-300 dark:border-slate-700"
                size="sm"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto md:pl-64 pt-4 pb-12 px-4 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

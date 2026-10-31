"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Check,
  CreditCard,
  Download,
  FileText,
  Globe,
  Lock,
  Mail,
  Moon,
  Sun,
  UserIcon,
  RefreshCw,
  Shield,
  Users,
  X,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { API_URL } from "@/app/lib/server-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Dynamic content component that uses client-side hooks
function SettingsFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useTheme();
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(tabParam || "profile");

  // Ensure theme component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/admins/${localStorage.getItem("adminId")}`,
          {
            method: "GET",
            headers: {
              "x-api-key": "thisisasdca",
              "Content-Type": "application/json",
              Authorization: `Authorization ${localStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
          form.setValue("name", result.data.name || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [form]);

  function onSubmit(data: ProfileFormValues) {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  }

  // Apply reduced animations to the document
  useEffect(() => {
    if (reduceAnimations) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [reduceAnimations]);

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
    : "U";

  if (!mounted) {
    return null;
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };



  return (
    <div className="container max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-20 w-20 border-4 text-center content-center items-center justify-center">
                  {initials}
                </Avatar>
                <h3 className="font-semibold text-lg mt-4">{userData?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {userData?.email}
                </p>
                <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  {userData?.role || "User"}
                </Badge>
              </div>

              <nav className="space-y-1">
                {/* <button
                  onClick={() => setActiveTab("subscription")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "subscription"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Subscription
                </button> */}
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "profile"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "account"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  Account
                </button>
                <button
                  onClick={() => setActiveTab("display")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "display"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  Display
                </button>
              </nav>
            </div>

            {/* {userData?.subscription && (
              <div className="bg-gradient-to-br from-primary/80 to-primary rounded-xl shadow-md text-white p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">
                      {userData.subscription?.plan?.name || "Free"}
                    </h3>
                    <p className="text-xs opacity-90">Active Plan</p>
                  </div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/10">
                    {userData.subscription?.order?.billingInterval === "yearly"
                      ? "Yearly"
                      : "Monthly"}
                  </Badge>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Next billing</span>
                    <span className="font-medium">
                      {userData.subscription?.order?.createdAt
                        ? formatDate(
                            new Date(
                              new Date(
                                userData.subscription.order.createdAt
                              ).setFullYear(
                                new Date(
                                  userData.subscription.order.createdAt
                                ).getFullYear() +
                                  (userData.subscription.order
                                    .billingInterval === "yearly"
                                    ? 1
                                    : 0)
                              )
                            ).toISOString()
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Amount</span>
                    <span className="font-medium">
                      {userData.subscription?.order?.currency || "$"}{" "}
                      {(
                        (userData.subscription?.order?.amount || 0) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                  onClick={() => setActiveTab("subscription")}
                >
                  Manage Subscription
                </Button>
              </div>
            )} */}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {activeTab === "subscription" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                  Subscription
                </h2>
              </div>

              
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Profile</h2>

              <Card className="border-border/40 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you on
                    the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <Avatar className="h-20 w-20 border-4 text-center content-center items-center justify-center">
                      {initials}
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">{userData?.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {userData?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Google Account
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                {...field}
                                className="max-w-md"
                              />
                            </FormControl>
                            <FormDescription>
                              This is the name that will be displayed on your
                              profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Account</h2>

              <Card className="border-border/40 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>
                    Manage your connected accounts and services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-slate-600"
                          >
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            <path d="M1 1h22v22H1z" fill="none" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Google</h4>
                          <p className="text-sm text-muted-foreground">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                        Connected
                      </Badge>
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Preferences</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">
                            Two-factor Authentication
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Two-factor authentication",
                              description: "This feature is coming soon.",
                            });
                          }}
                        >
                          Setup
                        </Button>
                      </div>
                      <Separator className="bg-border/60" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            toast({
                              title: "Account deletion",
                              description:
                                "This action cannot be undone. Please contact support if you're sure.",
                              variant: "destructive",
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "display" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Display</h2>

              <Card className="border-border/40 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>Theme Preferences</CardTitle>
                  <CardDescription>
                    Customize the appearance of the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Theme</h4>
                          <p className="text-sm text-muted-foreground">
                            Select your preferred theme
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size="sm"
                            className="gap-1"
                            onClick={() => setTheme("light")}
                          >
                            <Sun className="h-4 w-4" />
                            Light
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size="sm"
                            className="gap-1"
                            onClick={() => setTheme("dark")}
                          >
                            <Moon className="h-4 w-4" />
                            Dark
                          </Button>
                          <Button
                            variant={theme === "system" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("system")}
                          >
                            System
                          </Button>
                        </div>
                      </div>
                      <Separator className="bg-border/60" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Reduce animations</h4>
                          <p className="text-sm text-muted-foreground">
                            For users who prefer reduced motion
                          </p>
                        </div>
                        <Switch
                          checked={reduceAnimations}
                          onCheckedChange={setReduceAnimations}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Display preferences saved",
                        description:
                          "Your display preferences have been updated.",
                      });
                    }}
                  >
                    Save preferences
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export function SettingsForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SettingsFormContent />
    </Suspense>
  );
}

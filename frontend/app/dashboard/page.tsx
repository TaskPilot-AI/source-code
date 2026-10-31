"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  LayoutDashboard,
  Calendar,
  TrendingUp,
  Briefcase,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { API_URL } from "../lib/server-config";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface ProjectData {
  description: string;
  id: string;
  name: string;
  progress: number;
  status: string;
}

const DashboardOverview = () => {
  const [activeProject, setActiveProject] = useState<number>(0);
  const [taskCompletion, setTaskCompletion] = useState<number>(0);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [health, setHealth] = useState<string>("");
  const [healthDescription, setHealthDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.data) {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/projects/dashboard/${localStorage.getItem("adminId")}`,
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

        if (response.status === 401) {
          // window.location.href = "/";
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setActiveProject(data.data.active);
          setTaskCompletion(data.data.tasksCompleted);
          setTotalTasks(data.data.totalTasks);
          setTotalEmployees(data.data.totalEmployees);
          setHealth(data.data.health);
          setHealthDescription(data.data.healthDetail);

          const formattedProjects = data.data.projectHealthStatuses.map(
            (project: any) => ({
              id: project.id,
              name: project.name || "",
              description: project.description || "Simple toodd dfgh",
              progress: project.progress || 0,
              status: project.status || "ON_TRACK",
            })
          );

          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get status badge color based on project status
  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "ON_TRACK":
        return {
          color:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
          label: "On Track",
          icon: CheckCircle,
        };
      case "NEEDS_ATTENTION":
        return {
          color:
            "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900",
          label: "Needs Attention",
          icon: AlertTriangle,
        };
      case "AT_RISK":
        return {
          color:
            "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-900",
          label: "At Risk",
          icon: AlertCircle,
        };
      case "COMPLETED":
        return {
          color:
            "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400 border-sky-200 dark:border-sky-900",
          label: "Completed",
          icon: Star,
        };
      default:
        return {
          color:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
          label: "Unknown",
          icon: AlertCircle,
        };
    }
  };

  // Get progress color based on percentage
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "[&>div]:bg-rose-500";
    if (progress < 70) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-emerald-500";
  };

  // Get health status color
  const getHealthStatusColor = (health: string) => {
    const healthLower = health.toLowerCase();
    if (healthLower.includes("good") || healthLower.includes("excellent"))
      return "text-emerald-600 dark:text-emerald-400";
    if (healthLower.includes("fair") || healthLower.includes("average"))
      return "text-amber-600 dark:text-amber-400";
    if (healthLower.includes("poor") || healthLower.includes("critical"))
      return "text-rose-600 dark:text-rose-400";
    return "text-slate-600 dark:text-slate-400";
  };

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return {
          color:
            "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
        };
      case "medium":
        return {
          color:
            "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      case "low":
        return {
          color:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
        };
      default:
        return {
          color:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
        };
    }
  };

  return (
    <div className="space-y-8 px-4 py-6 max-w-8xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your AI-driven software projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <div className="rounded-full bg-slate-200 dark:bg-slate-800 p-1.5">
              <Briefcase className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{activeProject}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Projects currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-medium">
              Tasks Completed
            </CardTitle>
            <div className="rounded-full bg-slate-200 dark:bg-slate-800 p-1.5">
              <CheckCircle2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">
              {taskCompletion || 0}{" "}
              <span className="text-lg text-muted-foreground">
                / {totalTasks || 0}
              </span>
            </div>
            <div className="mt-2">
              <Progress
                value={(taskCompletion * 100) / (totalTasks || 1)}
                className={`h-2 ${getProgressColor(
                  (taskCompletion * 100) / (totalTasks || 1)
                )}`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((taskCompletion * 100) / (totalTasks || 1))}%
                completion rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <div className="rounded-full bg-slate-200 dark:bg-slate-800 p-1.5">
              <Users className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{totalEmployees}</div>

            <p className="text-xs text-muted-foreground mt-2">
              Active team members
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50 dark:bg-slate-900/50">
            <CardTitle className="text-sm font-medium">
              Project Health
            </CardTitle>
            <div className="rounded-full bg-slate-200 dark:bg-slate-800 p-1.5">
              <Activity className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div
              className={`text-3xl font-bold ${getHealthStatusColor(health)}`}
            >
              {health}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthDescription}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="bg-slate-100 dark:bg-slate-800/50">
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Recent Projects
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:block">
            <Button
              variant="outline"
              size="sm"
              className="mr-2 border-slate-300 dark:border-slate-700"
              onClick={() => router.push("/projects")}
            >
              All Projects
            </Button>
            <Button
              size="sm"
              className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
              onClick={() => router.push("/new-project")}
            >
              <Plus className="h-4 w-4 mr-1" /> New Project
            </Button>
          </div>
        </div>

        <TabsContent value="projects" className="space-y-6 mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              <XCircle className="h-10 w-10 text-rose-500 mb-2" />
              <p className="text-rose-500 font-medium">{error}</p>
              <Button
                variant="outline"
                className="mt-4 border-slate-300 dark:border-slate-700"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.length > 0 ? (
                  projects.slice(0, 6).map((project) => {
                    const statusProps = getStatusBadgeProps(project.status);
                    const StatusIcon = statusProps.icon;
                    return (
                      <Card
                        key={project.id}
                        className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700"
                      >
                        <CardHeader className="pb-2 relative">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl font-bold line-clamp-1 pr-20">
                              {project.name}
                            </CardTitle>
                            <Badge
                              className={cn(
                                "absolute top-4 right-4 font-medium",
                                statusProps.color
                              )}
                              variant="outline"
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusProps.label}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2 h-10">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-2">
                          <div>
                            <div className="flex justify-between items-center mb-1 text-sm">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                Progress
                              </span>
                              <span className="font-medium">
                                {project.progress}%
                              </span>
                            </div>
                            <Progress
                              value={project.progress}
                              className={`h-2 ${getProgressColor(
                                project.progress
                              )}`}
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            asChild
                          >
                            <Link
                              href={`/projects/${project.id}`}
                              className="flex items-center justify-center"
                            >
                              View Details{" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3">
                      <Briefcase className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      No projects found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md text-center">
                      You don't have any projects yet. Create your first project
                      to get started.
                    </p>
                    <Button
                      onClick={() => router.push("/new-project")}
                      className="mt-4 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </div>
                )}
              </div>
              {projects.length > 6 && (
                <div className="flex justify-center">
                  <Button
                    asChild
                    className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    <Link href="/projects">
                      View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;

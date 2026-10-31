"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Calendar,
  Loader2,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/app/lib/server-config";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  statusIcon: any;
  statusColor: string;
  team: string[];
  tasks: {
    completed: number;
    total: number;
  };
  lastUpdated: string;
  client: string;
  progress: number;
  projectType?: string;
  complexity?: string;
  ownerId?: string;
  timeEstimate?: string;
}

export default function ProjectsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    projectType: "",
    complexity: "",
    ownerId: "",
    timeEstimate: "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.data) {
      router.push("/");
    }
  }, [session, router]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (project.client ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (project.status ?? "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/projects/all/${localStorage.getItem("adminId")}`,
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
          window.location.href = "/sign-in";
          return;
        }
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const formattedProjects = data.data.map((project: any) => ({
            id: project.id ?? 0,
            title: project.title ?? "",
            description: project.description ?? "",
            status: project.status ?? "UNKNOWN",
            statusIcon:
              (project.status ?? "UNKNOWN") === "ACTIVE"
                ? CheckCircle2
                : AlertCircle,
            statusColor:
              (project.status ?? "UNKNOWN") === "ACTIVE"
                ? "text-green-500 bg-green-50 dark:bg-green-950/30"
                : "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
            team: project.team ?? [],
            tasks: {
              completed: project.tasks?.completed ?? 0,
              total: project.tasks?.total ?? 0,
            },
            lastUpdated: new Date(
              project.updatedAt ?? Date.now()
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            client: project.client ?? "",
            progress: project.progress ?? 0,
            projectType: project.projectType ?? "",
            complexity: project.complexity ?? "",
            ownerId: project.ownerId ?? "",
            timeEstimate: project.timeEstimate ?? "",
          }));

          setProjects(formattedProjects);
        } else {
          console.warn("API returned no data or invalid format");
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again later.",
          variant: "destructive",
        });
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteProject = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      if (data.success) {
        setProjects(projects.filter((project) => project.id !== id));
        setDeleteConfirm(null);
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
      } else {
        throw new Error(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (project: Project) => {
    setEditProject(project);
    // Set all existing values, even if they're empty
    setEditData({
      name: project.title || "",
      description: project.description || "",
      projectType: project.projectType || "",
      complexity: project.complexity || "",
      ownerId: project.ownerId || "",
      timeEstimate: project.timeEstimate || "",
    });
    setHasChanges(false);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSaveEdit = async () => {
    if (!editProject) return;
    if (!localStorage.getItem("adminId")) {
      toast({
        title: "Unauthorized",
        description: "You are not authorized to edit this project.",
        duration: 3000,
        variant: "destructive",
      });
      router.push("/");
      return;
    }
    try {
      const payload = {
        name: editData.name || "",
        description: editData.description || "",
        ownerId: localStorage.getItem("adminId"),
      };

      const res = await fetch(`${API_URL}/projects/${editProject.id}`, {
        method: "PUT",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update project");
      }

      if (data.success) {
        setProjects(
          projects.map((p) =>
            p.id === editProject.id
              ? {
                  ...p,
                  title: data.data.name,
                  description: data.data.description,
                  projectType: data.data.projectType,
                  complexity: data.data.complexity,
                  ownerId: data.data.ownerId,
                  timeEstimate: data.data.timeEstimate,
                }
              : p
          )
        );
        setEditProject(null);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        throw new Error(data.message || "Failed to update project");
      }
    } catch (err) {
      console.error("Error updating project:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-8 px-4 max-w-8xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
          Projects Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage and monitor all your AI-driven software projects in one place.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 border-slate-300 dark:border-slate-700 focus-visible:ring-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="on track">On Track</SelectItem>
              <SelectItem value="at risk">At Risk</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          asChild
          className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
        >
          <Link href="/new-project" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="task-card overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700"
              >
                <CardHeader className="pb-2 relative">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold line-clamp-1 pr-20">
                      {project.title}
                    </CardTitle>
                    <Badge
                      className={cn(
                        "absolute top-4 right-4 font-medium",
                        project.statusColor
                      )}
                      variant="outline"
                    >
                      <project.statusIcon className="h-3 w-3 mr-1" />
                      {project.status}
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
                        {Math.round(
                          (project.tasks.completed /
                            (project.tasks.total || 1)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        project.tasks.total > 0
                          ? (project.tasks.completed / project.tasks.total) *
                            100
                          : 0
                      }
                      className={`h-2 [&>div]:${getProgressColor(
                        project.tasks.total > 0
                          ? (project.tasks.completed / project.tasks.total) *
                              100
                          : 0
                      )}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-medium">
                        {project.tasks.completed}/{project.tasks.total} Tasks
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-medium">{project.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex -space-x-2">
                    {project.team.length > 0 ? (
                      project.team.slice(0, 3).map((member, i) => (
                        <Avatar
                          key={i}
                          className="h-7 w-7 border-2 border-background"
                        >
                          <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                            {member[0]}
                          </AvatarFallback>
                        </Avatar>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No team members
                      </span>
                    )}
                    {project.team.length > 3 && (
                      <Avatar className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                          +{project.team.length - 3}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem
                          onClick={() => router.push(`/projects/${project.id}`)}
                          className="cursor-pointer"
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditModal(project)}
                          className="cursor-pointer"
                        >
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400 cursor-pointer"
                          onClick={() => setDeleteConfirm(project.id)}
                        >
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3">
                <Search className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                {searchQuery || statusFilter !== "all"
                  ? "We couldn't find any projects matching your search criteria. Try adjusting your filters."
                  : "You don't have any projects yet. Create your first project to get started."}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button
                  asChild
                  className="mt-4 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  <Link href="/new-project">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-[425px] border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="border-slate-300 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirm && handleDeleteProject(deleteConfirm)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog
        open={editProject !== null}
        onOpenChange={(open) => !open && setEditProject(null)}
      >
        <DialogContent className="sm:max-w-[625px] border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Edit Project
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Modify the details of your existing project
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Project Name */}
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-slate-800 dark:text-slate-200 font-medium"
              >
                Project Name
              </Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="border-slate-300 dark:border-slate-700"
                placeholder="Enter project name"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label
                htmlFor="description"
                className="text-slate-800 dark:text-slate-200 font-medium"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) =>
                  handleEditChange("description", e.target.value)
                }
                className="border-slate-300 dark:border-slate-700 min-h-[100px] resize-none"
                placeholder="Describe your project"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSaveEdit}
              disabled={!hasChanges}
              className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 disabled:bg-slate-400 dark:disabled:bg-slate-800"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

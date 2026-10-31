"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpDown,
  CheckCheck,
  ListFilter,
  Users,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/app/lib/server-config";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { TaskDialog, TaskStatus, TaskPriority } from "@/components/task-dialog";
import { TaskActionsMenu } from "@/components/task-actions-menu";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

interface Assignee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  priorityIcon: any;
  priorityColor: string;
  assignees: Assignee[];
  project: string;
  projectId?: string;
  tag?: string;
}

export default function TasksView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const router = useRouter();
  const session = useSession();
    const { theme } = useTheme();

  useEffect(() => {
    if (!session.data) {
      router.push("/");
    }
  }, [session, router]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/tasks/all/${localStorage.getItem("adminId")}`,
        {
          method: "GET",
          headers: {
            "x-api-key": "thisisasdca",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 401) {
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      const mappedTasks = data.data.map((task: any) => {
        const assignees =
          task.assignedEmployees?.map((emp: any) => ({
            id: emp.id,
            name: emp.name,
            role: emp.role,
            avatar: emp.name[0],
          })) || [];

        let priorityIcon;
        let priorityColor;

        switch (task.priority) {
          case TaskPriority.HIGH:
            priorityIcon = AlertCircle;
            priorityColor = "text-red-500";
            break;
          case TaskPriority.MEDIUM:
            priorityIcon = Clock;
            priorityColor = "text-yellow-500";
            break;
          case TaskPriority.LOW:
            priorityIcon = Clock;
            priorityColor = "text-blue-500";
            break;
          default:
            priorityIcon = Clock;
            priorityColor = "text-yellow-500";
        }

        return {
          id: task.id,
          title: task.name ?? `Task ${task.id}`,
          description: task.description,
          status: task.status,
          priority: task.priority,
          priorityIcon,
          priorityColor,
          assignees,
          tag: task.tag,
          project: task.project?.name || "General",
          projectId: task.projectId || task.project?.id,
        };
      });

      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignees.some((assignee) =>
        assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesRole =
      roleFilter === "all" ||
      task.assignees.some((assignee) => assignee.role === roleFilter);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "completed" && task.status === TaskStatus.DONE) ||
      (activeTab === "in-progress" && task.status === TaskStatus.IN_PROGRESS) ||
      (activeTab === "to-do" && task.status === TaskStatus.TODO);

    return matchesSearch && matchesStatus && matchesRole && matchesTab;
  });

   const getStatusColor = (status: string) => {
     const isDark = theme === "dark";
     switch (status.toUpperCase()) {
       case "DONE":
         return isDark
           ? "bg-green-900/50 text-green-400 border-green-800"
           : "bg-green-100 text-green-800 border-green-200";
       case "IN_PROGRESS":
         return isDark
           ? "bg-blue-900/50 text-blue-400 border-blue-800"
           : "bg-blue-100 text-blue-800 border-blue-200";
       case "ASSIGNED":
         return isDark
           ? "bg-amber-900/50 text-amber-400 border-amber-800"
           : "bg-amber-100 text-amber-800 border-amber-200";
       case "NOT_STARTED":
         return isDark
           ? "bg-gray-800 text-gray-400 border-gray-700"
           : "bg-gray-100 text-gray-800 border-gray-200";
       case "DRAFT":
         return isDark
           ? "bg-gray-800 text-gray-400 border-gray-700"
           : "bg-gray-100 text-gray-800 border-gray-200";
       case "CREATED":
         return isDark
           ? "bg-blue-900/50 text-blue-400 border-blue-800"
           : "bg-blue-100 text-blue-800 border-blue-200";
       default:
         return isDark
           ? "bg-gray-800 text-gray-400 border-gray-700"
           : "bg-gray-100 text-gray-800 border-gray-200";
     }
   };
  return (
    <div className="space-y-6 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
            Tasks
          </h1>
          <p className="text-muted-foreground">
            View and manage tasks assigned to team members.
          </p>
        </div>
        <Button
          onClick={() => setIsTaskDialogOpen(true)}
          className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Task
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList className="bg-slate-100 dark:bg-slate-800/50 w-full sm:w-auto">
            <TabsTrigger
              value="all"
              className="flex gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <ListFilter className="h-4 w-4" />
              All Tasks
            </TabsTrigger>
            <TabsTrigger
              value="to-do"
              className="flex gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Clock className="h-4 w-4" />
              To Do
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="flex gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <ArrowUpDown className="h-4 w-4" />
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <CheckCheck className="h-4 w-4" />
              Completed
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <SelectValue placeholder="Filter by role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Senior Developer">
                  Senior Developer
                </SelectItem>
                <SelectItem value="Frontend Developer">
                  Frontend Developer
                </SelectItem>
                <SelectItem value="Business Analyst">
                  Business Analyst
                </SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="UX Designer">UX Designer</SelectItem>
                <SelectItem value="QA Engineer">QA Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks by name, description, project, or assignee..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TabsContent value={activeTab} className="space-y-0 m-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="task-card overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          {task.title}
                        </CardTitle>
                        <task.priorityIcon
                          className={`h-4 w-4 ${task.priorityColor}`}
                        />
                      </div>
                      <CardDescription className="line-clamp-2">
                        {task.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-3">
                      <div className="flex justify-between items-center">
                        <div
                          className={`inline-block rounded-md border px-2 py-1 text-xs ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.replace(/_/g, " ")}
                        </div>
                        <span
                          className={`text-sm font-medium ${task.priorityColor}`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      {task.assignees.length === 1 ? (
                        <div
                          key={task.assignees[0].id}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {task.assignees[0].avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium">
                              {task.assignees[0].name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {task.assignees[0].role}
                            </span>
                          </div>
                        </div>
                      ) : task.assignees.length > 1 ? (
                        <div className="flex -space-x-2">
                          {task.assignees.map((assignee, index) => (
                            <Avatar
                              key={assignee.id}
                              className="h-6 w-6 border border-background"
                              style={{ zIndex: task.assignees.length - index }}
                            >
                              <AvatarFallback>{assignee.avatar}</AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium ml-1">
                            {task.assignees.length}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          No assignees
                        </div>
                      )}

                      <div className="flex justify-between text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Project:{" "}
                          </span>
                          <span className="font-medium">{task.project}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end items-center pt-0">
                      <TaskActionsMenu task={task} onTaskUpdated={fetchTasks} />
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We couldn't find any tasks matching your search criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onTaskSaved={fetchTasks}
      />
    </div>
  );
}

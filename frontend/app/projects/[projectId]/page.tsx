"use client";
import { API_URL } from "@/app/lib/server-config";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  Users,
  AlertTriangle,
  ArrowUpRight,
  X,
  Download,
  ChevronRight,
  ChevronLeft,
  Info,
  MessageSquare,
  FolderPlus,
  Calendar,
  MoreHorizontal,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ResearchAssistant from "@/components/research-assistant";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  location: string;
  avatar?: string;
}

interface Document {
  id: string;
  name: string;
  description: string;
  doc_body: string;
  createdBy: string;
  createdAt: string;
  status: string;
}

interface Comment {
  id: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  commentorId: string;
  taskId: string;
  projectId: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  due: string;
  status: string;
  priority: string;
  tag: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  assignedEmployees?: { name: string; id: string }[];
  comments?: Comment[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  projectType: string;
  completionStatus: string;
  complexity: string;
  timeEstimate: number;
  createdAt: string;
  employeesWorkingOn: Employee[];
  documents: Document[];
  tasks: Task[];
  ownerId: string;
}

// Activity interface
interface Activity {
  id: string;
  type:
    | "task_completed"
    | "status_change"
    | "comment"
    | "assignment"
    | "project_created"
    | "document_created";
  date: string;
  user: string;
  userId: string;
  details: {
    taskId?: string;
    taskName?: string;
    documentId?: string;
    documentName?: string;
    oldStatus?: string;
    newStatus?: string;
    commentText?: string;
    projectName?: string;
    description?: string;
    userId?: string;
    user?: string;
  };
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = React.use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const session = useSession();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [taskFilter, setTaskFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setpriorityFilter] = useState<string>("all");

  const [documentSearchQuery, setDocumentSearchQuery] = useState<string>("");
  const [documentStatusFilter, setDocumentStatusFilter] =
    useState<string>("all");

  // Gantt chart state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [timeScale, setTimeScale] = useState<"day" | "week" | "month">("week");
  const [ganttStartDate, setGanttStartDate] = useState<Date>(new Date());
  const [ganttEndDate, setGanttEndDate] = useState<Date>(new Date());

  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [expandedTaskGroups, setExpandedTaskGroups] = useState<
    Record<string, boolean>
  >({});
  const [activityPage, setActivityPage] = useState<number>(1);
  const [loadingMoreActivities, setLoadingMoreActivities] =
    useState<boolean>(false);
  const [activityDateRange, setActivityDateRange] = useState<
    "week" | "month" | "all"
  >("week");
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!session.data) {
      router.push("/");
    }
  }, [session]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/projects/${resolvedParams.projectId}`,
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
          window.location.href = "/sign-in";
          return;
        }

        const result = await response.json();
        setProject(result.data);

        // Generate activities from project data
        if (result.data) {
          generateActivities(result.data);
        }

        // Calculate gantt chart date range
        if (result.data && result.data.tasks && result.data.tasks.length > 0) {
          const dates = result.data.tasks.flatMap((task: Task) => [
            new Date(task.createdAt),
            new Date(task.due),
          ]);

          const minDate = new Date(
            Math.min(...dates.map((d: any) => d.getTime()))
          );
          const maxDate = new Date(
            Math.max(...dates.map((d: any) => d.getTime()))
          );

          // Add buffer days
          minDate.setDate(minDate.getDate() - 3);
          maxDate.setDate(maxDate.getDate() + 3);

          setGanttStartDate(minDate);
          setGanttEndDate(maxDate);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [resolvedParams.projectId]);

  // Generate activities from project data
  const generateActivities = (projectData: Project) => {
    const activityList: Activity[] = [];

    // Project creation activity
    activityList.push({
      id: `project-created-${projectData.id}`,
      type: "project_created",
      date: projectData.createdAt,
      user: "Project Admin",
      userId: projectData.ownerId,
      details: {
        projectName: projectData.name,
        description: projectData.description,
      },
    });

    // Document creation activities
    projectData.documents.forEach((doc) => {
      activityList.push({
        id: `doc-created-${doc.id}`,
        type: "document_created",
        date: doc.createdAt,
        user: doc.createdBy,
        userId: projectData.ownerId,
        details: {
          documentId: doc.id,
          documentName: doc.name,
          description: doc.description,
        },
      });
    });

    // Task activities
    projectData.tasks.forEach((task) => {
      // Task completion activities for DONE tasks
      if (task.status === "DONE") {
        activityList.push({
          id: `task-completed-${task.id}`,
          type: "task_completed",
          date: task.updatedAt,
          user:
            task.assignedEmployees && task.assignedEmployees.length > 0
              ? task.assignedEmployees[0].name
              : "Team Member",
          userId:
            task.assignedEmployees && task.assignedEmployees.length > 0
              ? task.assignedEmployees[0].id
              : "",
          details: {
            taskId: task.id,
            taskName: task.name,
            description: task.description,
          },
        });

        // Status change activities
        activityList.push({
          id: `status-change-${task.id}`,
          type: "status_change",
          date: task.updatedAt,
          user:
            task.assignedEmployees && task.assignedEmployees.length > 0
              ? task.assignedEmployees[0].name
              : "Team Member",
          userId:
            task.assignedEmployees && task.assignedEmployees.length > 0
              ? task.assignedEmployees[0].id
              : "",
          details: {
            taskId: task.id,
            taskName: task.name,
            oldStatus: "ASSIGNED",
            newStatus: "DONE",
          },
        });
      }

      // Assignment activities
      if (task.assignedEmployees && task.assignedEmployees.length > 0) {
        activityList.push({
          id: `assignment-${task.id}`,
          type: "assignment",
          date: task.createdAt,
          user: "Project Admin",
          userId: projectData.ownerId,
          details: {
            taskId: task.id,
            taskName: task.name,
            userId: task.assignedEmployees[0].id,
            user: task.assignedEmployees[0].name,
          },
        });
      }

      // Comment activities
      if (task.comments && task.comments.length > 0) {
        task.comments.forEach((comment) => {
          const commenter = projectData.employeesWorkingOn.find(
            (emp) => emp.id === comment.commentorId
          );
          activityList.push({
            id: `comment-${comment.id}`,
            type: "comment",
            date: comment.createdAt,
            user: commenter ? commenter.name : "Team Member",
            userId: comment.commentorId,
            details: {
              taskId: task.id,
              taskName: task.name,
              commentText: comment.text,
            },
          });
        });
      }
    });

    // Sort activities by date (newest first)
    activityList.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setActivities(activityList);
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days remaining until due date
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get color based on priority
  const getPriorityColor = (priority: string) => {
    const isDark = theme === "dark";
    switch (priority.toLowerCase()) {
      case "high":
        return isDark ? "text-red-400 bg-red-950/50" : "text-red-600 bg-red-50";
      case "medium":
        return isDark
          ? "text-amber-400 bg-amber-950/50"
          : "text-amber-600 bg-amber-50";
      case "low":
        return isDark
          ? "text-emerald-400 bg-emerald-950/50"
          : "text-emerald-600 bg-emerald-50";
      default:
        return isDark
          ? "text-gray-400 bg-gray-800"
          : "text-gray-600 bg-gray-100";
    }
  };

  // Get color based on status
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

  // Get status color for gantt chart
  const getGanttStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DONE":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "ASSIGNED":
        return "bg-amber-500";
      case "NOT_STARTED":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get color based on completion status
  const getCompletionStatusColor = (status: string) => {
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
      case "PLANNING":
        return isDark
          ? "bg-purple-900/50 text-purple-400 border-purple-800"
          : "bg-purple-100 text-purple-800 border-purple-200";
      case "ON_HOLD":
        return isDark
          ? "bg-amber-900/50 text-amber-400 border-amber-800"
          : "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return isDark
          ? "bg-gray-800 text-gray-400 border-gray-700"
          : "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get initials for Avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle document view
  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  // Handle PDF download
  const handleDownloadPDF = (doc: Document) => {
    const pdf = new jsPDF();

    // Add title
    pdf.setFontSize(16);
    pdf.text(doc.name, 20, 20);

    // Add metadata
    pdf.setFontSize(12);
    pdf.text(`Description: ${doc.description}`, 20, 30);
    pdf.text(`Created by: ${doc.createdBy}`, 20, 40);
    pdf.text(`Created: ${formatDate(doc.createdAt)}`, 20, 50);
    pdf.text(`Status: ${doc.status}`, 20, 60);

    // Add document content
    pdf.setFontSize(10);
    const bodyLines = pdf.splitTextToSize(
      doc.doc_body || "No content available",
      170
    ); // Split text to fit page width
    pdf.text(bodyLines, 20, 80);

    // Download the PDF
    pdf.save(`${doc.name}.pdf`);
  };

  // Gantt chart functions
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDrawerOpen(true);
  };

  const getDaysInRange = () => {
    const days = [];
    const currentDate = new Date(ganttStartDate);

    while (currentDate <= ganttEndDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getWeeksInRange = () => {
    const weeks = [];
    const currentDate = new Date(ganttStartDate);

    // Go to the start of the week
    const dayOfWeek = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - dayOfWeek);

    while (currentDate <= ganttEndDate) {
      weeks.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  };

  const getMonthsInRange = () => {
    const months = [];
    const currentDate = new Date(ganttStartDate);

    // Go to the start of the month
    currentDate.setDate(1);

    while (currentDate <= ganttEndDate) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  };

  const getTimeUnits = () => {
    switch (timeScale) {
      case "day":
        return getDaysInRange();
      case "week":
        return getWeeksInRange();
      case "month":
        return getMonthsInRange();
      default:
        return getDaysInRange();
    }
  };

  const formatTimeUnit = (date: Date) => {
    switch (timeScale) {
      case "day":
        return date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
      case "week":
        return `${date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })}`;
      case "month":
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      default:
        return date.toLocaleDateString();
    }
  };

  const getTaskPosition = (task: Task) => {
    const startDate = new Date(task.createdAt);
    const endDate = new Date(task.due);

    const timeUnits = getTimeUnits();
    const totalUnits = timeUnits.length;

    // Calculate position as percentage
    const startUnit = timeUnits.findIndex((unit) => {
      if (timeScale === "day") {
        return unit.toDateString() === startDate.toDateString();
      } else if (timeScale === "week") {
        const weekStart = new Date(unit);
        const weekEnd = new Date(unit);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return startDate >= weekStart && startDate <= weekEnd;
      } else {
        const monthStart = new Date(unit);
        const monthEnd = new Date(unit);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);
        return startDate >= monthStart && startDate <= monthEnd;
      }
    });

    const endUnit = timeUnits.findIndex((unit) => {
      if (timeScale === "day") {
        return unit.toDateString() === endDate.toDateString();
      } else if (timeScale === "week") {
        const weekStart = new Date(unit);
        const weekEnd = new Date(unit);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return endDate >= weekStart && endDate <= weekEnd;
      } else {
        const monthStart = new Date(unit);
        const monthEnd = new Date(unit);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);
        return endDate >= monthStart && startDate <= monthEnd;
      }
    });

    // If task doesn't fit in the visible range, adjust
    const start = Math.max(0, startUnit !== -1 ? startUnit : 0);
    const end = Math.min(
      totalUnits - 1,
      endUnit !== -1 ? endUnit : totalUnits - 1
    );

    // Calculate width as percentage of total
    const width = ((end - start + 1) / totalUnits) * 100;
    const left = (start / totalUnits) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  const adjustTimeRange = (direction: "forward" | "backward") => {
    const newStartDate = new Date(ganttStartDate);
    const newEndDate = new Date(ganttEndDate);

    const daysDiff = Math.ceil(
      (ganttEndDate.getTime() - ganttStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (direction === "forward") {
      newStartDate.setDate(newStartDate.getDate() + daysDiff);
      newEndDate.setDate(newEndDate.getDate() + daysDiff);
    } else {
      newStartDate.setDate(newStartDate.getDate() - daysDiff);
      newEndDate.setDate(newEndDate.getDate() - daysDiff);
    }

    setGanttStartDate(newStartDate);
    setGanttEndDate(newEndDate);
  };

  const toggleTaskGroupExpansion = (groupId: string) => {
    setExpandedTaskGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const loadMoreActivities = () => {
    setLoadingMoreActivities(true);
    // Simulate loading more activities
    setTimeout(() => {
      setActivityPage((prev) => prev + 1);
      setLoadingMoreActivities(false);
    }, 800);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle className="h-4 w-4" />;
      case "status_change":
        return <ArrowUpRight className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "assignment":
        return <Users className="h-4 w-4" />;
      case "project_created":
        return <FolderPlus className="h-4 w-4" />;
      case "document_created":
        return <FileText className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    const isDark = theme === "dark";
    switch (type) {
      case "task_completed":
        return isDark
          ? "bg-green-900/60 text-green-400 ring-gray-950"
          : "bg-green-100 text-green-600 ring-background";
      case "status_change":
        return isDark
          ? "bg-blue-900/60 text-blue-400 ring-gray-950"
          : "bg-blue-100 text-blue-600 ring-background";
      case "comment":
        return isDark
          ? "bg-purple-900/60 text-purple-400 ring-gray-950"
          : "bg-purple-100 text-purple-600 ring-background";
      case "assignment":
        return isDark
          ? "bg-amber-900/60 text-amber-400 ring-gray-950"
          : "bg-amber-100 text-amber-600 ring-background";
      case "project_created":
        return isDark
          ? "bg-indigo-900/60 text-indigo-400 ring-gray-950"
          : "bg-indigo-100 text-indigo-600 ring-background";
      case "document_created":
        return isDark
          ? "bg-rose-900/60 text-rose-400 ring-gray-950"
          : "bg-rose-100 text-rose-600 ring-background";
      default:
        return isDark
          ? "bg-gray-800 text-gray-400 ring-gray-950"
          : "bg-gray-100 text-gray-600 ring-background";
    }
  };

  // Group activities by date
  const groupActivitiesByDate = () => {
    const groups: Record<string, Activity[]> = {};

    // Filter activities based on selected filter
    const filteredActivities = activities.filter((activity) => {
      if (activityFilter === "all") return true;
      return activity.type === activityFilter;
    });

    // Filter activities based on date range
    const filteredByDate = filteredActivities.filter((activity) => {
      const activityDate = new Date(activity.date);
      const now = new Date();

      if (activityDateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return activityDate >= weekAgo;
      } else if (activityDateRange === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return activityDate >= monthAgo;
      }

      return true; // "all" date range
    });

    // Group by date
    filteredByDate.forEach((activity) => {
      const date = new Date(activity.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });

    return groups;
  };

  // Format relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffMins > 0) {
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
    } else {
      return "just now";
    }
  };

  // Get completed tasks count
  const getCompletedTasksCount = () => {
    if (!project) return 0;
    return project.tasks.filter((task) => task.status === "DONE").length;
  };

  // Get activity counts by type
  const getActivityCountsByType = () => {
    const counts = {
      completed: 0,
      statusUpdates: 0,
      comments: 0,
    };

    activities.forEach((activity) => {
      if (activity.type === "task_completed") counts.completed++;
      if (activity.type === "status_change") counts.statusUpdates++;
      if (activity.type === "comment") counts.comments++;
    });

    return counts;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-32" /> <Skeleton className="h-32" />{" "}
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex h-[80vh] items-center justify-center p-6">
        <Card className="max-w-md border-red-300 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600 dark:text-red-400">
              <AlertTriangle className="mr-2 h-5 w-5" /> Error Loading Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto flex h-[80vh] items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-200">
              Project Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              The project you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter tasks based on search query and filters
  const filteredTasks =
    project?.tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      // Priority filter
      const matchesPriority =
        priorityFilter === "all" ||
        task.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    }) || [];

  // Filter documents based on search query and filters
  const filteredDocuments =
    project?.documents.filter((doc) => {
      // Search filter
      const matchesSearch =
        documentSearchQuery === "" ||
        doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.description
          .toLowerCase()
          .includes(documentSearchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        documentStatusFilter === "all" || doc.status === documentStatusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  // Group activities by date
  const activityGroups = groupActivitiesByDate();
  const activityDates = Object.keys(activityGroups).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Get activity counts
  const activityCounts = getActivityCountsByType();

  return (
    <div className="container mx-auto p-6">
      {/* Project Header */}
      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gray-950">
        <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                {project.name}
              </h1>
              <Badge
                className={`border ${getCompletionStatusColor(
                  project.completionStatus
                )}`}
              >
                {project.completionStatus.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Badge
            variant="outline"
            className="flex items-center border-slate-300 px-3 py-1 text-gray-700 dark:border-slate-700 dark:text-gray-300"
          >
            <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>{" "}
            {project.projectType}
          </Badge>
          <Badge
            variant="outline"
            className="flex items-center border-slate-300 px-3 py-1 text-gray-700 dark:border-slate-700 dark:text-gray-300"
          >
            <span className="mr-1 h-2 w-2 rounded-full bg-purple-500"></span>{" "}
            {project.complexity} Complexity
          </Badge>
          <div className="flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300">
            <Clock className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />{" "}
            <span>{project.timeEstimate} hours est.</span>
          </div>
          <div className="flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300">
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />{" "}
            <span>Created: {formatDate(project.createdAt)}</span>
          </div>
          <Button
            variant="outline"
            className="ml-2 flex items-center gap-2"
            onClick={() =>
              router.push(`/projects/${project.id}/report`)
            }
          >
            <BarChart3 className="h-4 w-4" />
            View Report
          </Button>
        </div>
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Project Progress
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {Math.round(
                (project.tasks.filter((t) => t.status === "DONE").length /
                  project.tasks.length) *
                  100
              )}
              %
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{
                width: `${Math.round(
                  (project.tasks.filter((t) => t.status === "DONE").length /
                    project.tasks.length) *
                    100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-6">
        {/* Updated Tab Bar to match the image */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="bg-slate-100 dark:bg-slate-800/50">
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              Tasks ({project.tasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="gantt"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              Gantt Chart
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              Team ({project.employeesWorkingOn.length})
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              Documents ({project.documents.length})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              Research AI
            </TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                className="h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Project Tasks
            </h2>
            <div className="flex items-center space-x-2">
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="DONE">DONE</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="NOT_STARTED">Not Started</option>
              </select>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={priorityFilter}
                onChange={(e) => setpriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {task.name}
                      </CardTitle>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div
                        className={`inline-block rounded-md border px-2 py-1 text-xs ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status.replace(/_/g, " ")}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="mr-2 h-4 w-4" /> Due:{" "}
                        {formatDate(task.due)}
                        {getDaysRemaining(task.due) >= 0 ? (
                          <span className="ml-2 text-green-600 dark:text-green-400">
                            ({getDaysRemaining(task.due)} days left)
                          </span>
                        ) : (
                          <span className="ml-2 text-red-600 dark:text-red-400">
                            (Overdue by {Math.abs(getDaysRemaining(task.due))}{" "}
                            days)
                          </span>
                        )}
                      </div>
                      {task.assignedEmployees &&
                        task.assignedEmployees.length > 0 && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Users className="mr-2 h-4 w-4" /> Assigned to:{" "}
                            {task.assignedEmployees[0].name}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No tasks found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Add a task to get started"}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Gantt Chart Tab */}
        <TabsContent value="gantt" className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Project Timeline
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-950">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    timeScale === "day"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : ""
                  }`}
                  onClick={() => setTimeScale("day")}
                >
                  Day
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    timeScale === "week"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : ""
                  }`}
                  onClick={() => setTimeScale("week")}
                >
                  Week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    timeScale === "month"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : ""
                  }`}
                  onClick={() => setTimeScale("month")}
                >
                  Month
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustTimeRange("backward")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustTimeRange("forward")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Gantt Chart Header */}
                  <div className="flex border-b border-gray-200 dark:border-gray-800">
                    <div className="w-1/4 min-w-[250px] border-r border-gray-200 p-4 dark:border-gray-800">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Task
                      </h3>
                    </div>
                    <div className="w-3/4 overflow-hidden">
                      <div className="flex">
                        {getTimeUnits().map((unit, index) => (
                          <div
                            key={index}
                            className="flex-1 border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400"
                          >
                            {formatTimeUnit(unit)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gantt Chart Body */}
                  <div className="relative">
                    {project.tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className={`flex ${
                          index !== project.tasks.length - 1
                            ? "border-b border-gray-200 dark:border-gray-800"
                            : ""
                        }`}
                      >
                        <div
                          className="w-1/4 min-w-[250px] border-r border-gray-200 p-4 dark:border-gray-800"
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {task.name}
                            </span>
                            <div className="mt-1 flex items-center space-x-2">
                              <Badge
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                              <div
                                className={`inline-block rounded-md border px-2 py-1 text-xs ${getStatusColor(
                                  task.status
                                )}`}
                              >
                                {task.status.replace(/_/g, " ")}
                              </div>
                            </div>
                            {task.assignedEmployees &&
                              task.assignedEmployees.length > 0 && (
                                <div className="mt-2 flex items-center text-xs text-gray-600 dark:text-gray-400">
                                  <Users className="mr-1 h-3 w-3" />
                                  <div className="flex items-center">
                                    <div className="flex -space-x-1 mr-1">
                                      {task.assignedEmployees
                                        .slice(0, 3)
                                        .map((employee) => (
                                          <Avatar
                                            key={employee.id}
                                            className="h-5 w-5 border border-background"
                                          >
                                            <AvatarFallback className="text-[8px]">
                                              {getInitials(employee.name)}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                    </div>
                                    {task.assignedEmployees.length > 3 && (
                                      <span className="text-xs">
                                        +{task.assignedEmployees.length - 3}{" "}
                                        more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="relative w-3/4 py-4">
                          <div
                            className={`absolute cursor-pointer rounded-md ${getGanttStatusColor(
                              task.status
                            )} hover:opacity-80`}
                            style={{
                              ...getTaskPosition(task),
                              height: "30px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                            onClick={() => handleTaskClick(task)}
                          >
                            <div className="flex h-full items-center justify-between px-2">
                              <span className="truncate text-xs font-medium text-white">
                                {task.name}
                              </span>
                              <div className="flex items-center">
                                {task.assignedEmployees &&
                                  task.assignedEmployees.length > 0 && (
                                    <div className="flex -space-x-1 mr-1">
                                      {task.assignedEmployees
                                        .slice(0, 2)
                                        .map((employee) => (
                                          <Avatar
                                            key={employee.id}
                                            className="h-4 w-4 border border-white"
                                          >
                                            <AvatarFallback className="text-[8px]">
                                              {getInitials(employee.name)}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                      {task.assignedEmployees.length > 2 && (
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-700 text-[8px] text-white">
                                          +{task.assignedEmployees.length - 2}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                <Info className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                DONE
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                IN PROGRESS
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ASSIGNED
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-gray-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                NOT STARTED
              </span>
            </div>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Team Members
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search team members..."
                  className="h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.employeesWorkingOn.map((employee) => (
              <Card
                key={employee.id}
                className="border-gray-200 dark:border-gray-800"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={employee.avatar || "/placeholder.svg"}
                        alt={employee.name}
                      />
                      <AvatarFallback>
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {employee.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                        {employee.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Email:</span>{" "}
                      {employee.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Location:</span>{" "}
                      {employee.location}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Project Documents
            </h2>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                className="h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={documentSearchQuery}
                onChange={(e) => setDocumentSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="border-gray-200 dark:border-gray-800"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {doc.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                    {doc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div
                      className={`inline-block rounded-md border px-2 py-1 text-xs ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {doc.status.replace(/_/g, " ")}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Created by: {doc.createdBy}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Created: {formatDate(doc.createdAt)}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      router.push(`/documents/${doc.id}`);
                    }}
                  >
                    View Document
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Project Activity
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-950">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    activityDateRange === "week"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : ""
                  }`}
                  onClick={() => setActivityDateRange("week")}
                >
                  Last Week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    activityDateRange === "month"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : ""
                  }`}
                  onClick={() => setActivityDateRange("month")}
                >
                  Last Month
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    activityDateRange === "all"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : ""
                  }`}
                  onClick={() => setActivityDateRange("all")}
                >
                  All Time
                </Button>
              </div>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
              >
                <option value="all">All Activities</option>
                <option value="task_completed">Task Completions</option>
                <option value="status_change">Status Changes</option>
                <option value="comment">Comments</option>
                <option value="assignment">Assignments</option>
                <option value="document_created">Documents</option>
              </select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setActivityPage(1)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh activities</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="relative">
                {/* Activity Timeline */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>

                <div className="space-y-8">
                  {/* Group activities by date */}
                  {activityDates.length > 0 ? (
                    activityDates.map((date, dateIndex) => (
                      <div key={date} className="relative pl-12">
                        <div className="mb-4 sticky top-0 bg-background py-2 z-10 flex items-center">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {new Date(date).toLocaleDateString() ===
                            new Date().toLocaleDateString()
                              ? "Today"
                              : new Date(date).toLocaleDateString() ===
                                new Date(
                                  Date.now() - 86400000
                                ).toLocaleDateString()
                              ? "Yesterday"
                              : formatDate(date)}
                          </h3>
                          <div className="ml-2 flex items-center text-xs text-gray-400 dark:text-gray-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>

                        {activityGroups[date].map((activity, activityIndex) => (
                          <div
                            key={activity.id}
                            className="relative mb-6 group"
                          >
                            <div
                              className={`absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full ring-8 ${getActivityColor(
                                activity.type
                              )} transition-all duration-200 group-hover:scale-110`}
                            >
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                  {activity.type !== "project_created" && (
                                    <Avatar className="h-6 w-6 border border-gray-200 dark:border-gray-800">
                                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                        {getInitials(activity.user)}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {activity.user}
                                  </span>

                                  {activity.type === "task_completed" && (
                                    <>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        completed a task
                                      </span>
                                    </>
                                  )}

                                  {activity.type === "status_change" && (
                                    <>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        changed status from
                                      </span>
                                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400">
                                        {activity.details.oldStatus}
                                      </Badge>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        to
                                      </span>
                                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400">
                                        {activity.details.newStatus}
                                      </Badge>
                                    </>
                                  )}

                                  {activity.type === "comment" && (
                                    <>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        commented on
                                      </span>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {activity.details.taskName}
                                      </span>
                                    </>
                                  )}

                                  {activity.type === "assignment" && (
                                    <>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        assigned
                                      </span>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {activity.details.user}
                                      </span>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        to
                                      </span>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {activity.details.taskName}
                                      </span>
                                    </>
                                  )}

                                  {activity.type === "project_created" && (
                                    <>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        created the project
                                      </span>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {activity.details.projectName}
                                      </span>
                                    </>
                                  )}

                                  {activity.type === "document_created" && (
                                    <>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        created document
                                      </span>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {activity.details.documentName}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-500 dark:text-gray-500">
                                    {getRelativeTime(activity.date)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 ml-1"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Activity details */}
                              {(activity.type === "task_completed" ||
                                activity.type === "status_change") &&
                                activity.details.taskName && (
                                  <div className="mt-2 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                      {activity.details.taskName}
                                    </p>
                                    {activity.details.description && (
                                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {activity.details.description}
                                      </p>
                                    )}
                                  </div>
                                )}

                              {activity.type === "comment" &&
                                activity.details.commentText && (
                                  <div className="mt-2 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
                                    <p className="text-gray-600 dark:text-gray-400">
                                      {activity.details.commentText}
                                    </p>
                                  </div>
                                )}

                              {activity.type === "project_created" &&
                                activity.details.description && (
                                  <div className="mt-2 rounded-md bg-gray-50 p-3 dark:bg-gray-900">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {activity.details.description}
                                    </p>
                                  </div>
                                )}

                              {/* Action buttons */}
                              {activity.type === "comment" && (
                                <div className="mt-2 flex justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                  >
                                    <MessageSquare className="mr-1 h-3 w-3" />
                                    Reply
                                  </Button>
                                </div>
                              )}

                              {activity.type === "document_created" && (
                                <div className="mt-2 flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() => {
                                      router.push(
                                        `/documents/${activity.details.documentId}`
                                      );
                                    }}
                                  >
                                    <FileText className="mr-1 h-3 w-3" />
                                    View Document
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                        <Calendar className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                        No activities found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try adjusting your filters or date range
                      </p>
                    </div>
                  )}
                </div>

                {activityDates.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      variant="outline"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={loadMoreActivities}
                      disabled={loadingMoreActivities}
                    >
                      {loadingMoreActivities ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Task Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {getCompletedTasksCount()}/{project.tasks.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tasks completed
                    </p>
                  </div>
                  <div className="relative h-20 w-20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(
                          (getCompletedTasksCount() / project.tasks.length) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <svg
                      className="h-20 w-20 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        className="fill-none stroke-gray-200 dark:stroke-gray-800"
                        cx="50"
                        cy="50"
                        r="40"
                        strokeWidth="10"
                      />
                      <circle
                        className="fill-none stroke-blue-500"
                        cx="50"
                        cy="50"
                        r="40"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset={
                          251.2 -
                          251.2 *
                            (getCompletedTasksCount() / project.tasks.length)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Completed
                    </span>
                  </div>
                  <span className="font-medium">
                    {getCompletedTasksCount()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mr-1"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      In Progress
                    </span>
                  </div>
                  <span className="font-medium">
                    {
                      project.tasks.filter(
                        (t) =>
                          t.status === "ASSIGNED" || t.status === "IN_PROGRESS"
                      ).length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {activities.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total activities
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Completed Tasks
                        </span>
                      </div>
                      <span className="font-medium">
                        {activityCounts.completed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Status Updates
                        </span>
                      </div>
                      <span className="font-medium">
                        {activityCounts.statusUpdates}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-purple-500 mr-1"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Comments
                        </span>
                      </div>
                      <span className="font-medium">
                        {activityCounts.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.employeesWorkingOn.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-800">
                          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {employee.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {
                          activities.filter((a) => a.userId === employee.id)
                            .length
                        }{" "}
                        activities
                      </div>
                    </div>
                  ))}

                  {project.employeesWorkingOn.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" size="sm" className="w-full">
                        <Users className="mr-2 h-4 w-4" />
                        View All Team Members
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Research Tab */}
        <TabsContent value="research" className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              AI Research Assistant
            </h2>
          </div>
          <ResearchAssistant projectId={project.id} />
        </TabsContent>
      </Tabs>

      {/* Document Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedDocument?.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    selectedDocument && handleDownloadPDF(selectedDocument)
                  }
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium">Description:</span>{" "}
                {selectedDocument?.description}
              </p>
              <p>
                <span className="font-medium">Created by:</span>{" "}
                {selectedDocument?.createdBy}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {selectedDocument && formatDate(selectedDocument.createdAt)}
              </p>
              <div
                className={`inline-block rounded-md border px-2 py-1 text-xs ${
                  selectedDocument && getStatusColor(selectedDocument.status)
                }`}
              >
                {selectedDocument?.status.replace(/_/g, " ")}
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>
                {selectedDocument?.doc_body || "No content available"}
              </ReactMarkdown>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Drawer */}
      <Sheet open={isTaskDrawerOpen} onOpenChange={setIsTaskDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {selectedTask?.name}
            </SheetTitle>
            <SheetDescription className="text-gray-600 dark:text-gray-400">
              {selectedTask?.description}
            </SheetDescription>
          </SheetHeader>

          {selectedTask && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Status
                </h3>
                <div
                  className={`inline-block rounded-md border px-2 py-1 text-xs ${getStatusColor(
                    selectedTask.status
                  )}`}
                >
                  {selectedTask.status.replace(/_/g, " ")}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Priority
                </h3>
                <Badge className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Timeline
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(selectedTask.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">Due:</span>{" "}
                    {formatDate(selectedTask.due)}
                    {getDaysRemaining(selectedTask.due) >= 0 ? (
                      <span className="ml-2 text-green-600 dark:text-green-400">
                        ({getDaysRemaining(selectedTask.due)} days left)
                      </span>
                    ) : (
                      <span className="ml-2 text-red-600 dark:text-red-400">
                        (Overdue by{" "}
                        {Math.abs(getDaysRemaining(selectedTask.due))} days)
                      </span>
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDate(selectedTask.updatedAt)}
                  </p>
                </div>
              </div>

              {selectedTask.assignedEmployees &&
                selectedTask.assignedEmployees.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Assigned To
                    </h3>
                    <div className="space-y-2">
                      {selectedTask.assignedEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{employee.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedTask.comments && selectedTask.comments.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Comments ({selectedTask.comments.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedTask.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {comment.text}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

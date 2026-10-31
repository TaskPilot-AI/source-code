"use client"
import { API_URL } from "@/app/lib/server-config"
import React, { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import { useTheme } from "next-themes"
import ReactMarkdown from "react-markdown"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import jsPDF from "jspdf"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client";

interface Employee {
  id: string
  name: string
  email: string
  role: string
  skills: string[]
  location: string
  avatar?: string
}

interface Document {
  id: string
  name: string
  description: string
  body: string
  createdBy: string
  createdAt: string
  status: string
}

interface Task {
  id: string
  name: string
  description: string
  due: string
  status: string
  priority: string
  tag: string
  assignedTo?: string
}

interface Project {
  id: string
  name: string
  description: string
  projectType: string
  completionStatus: string
  complexity: string
  timeEstimate: number
  createdAt: string
  employeesWorkingOn: Employee[]
  documents: Document[]
  tasks: Task[]
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const resolvedParams = React.use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const session = useSession()

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [taskFilter, setTaskFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setpriorityFilter] = useState<string>("all")

  const [documentSearchQuery, setDocumentSearchQuery] = useState<string>("")
  const [documentStatusFilter, setDocumentStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (!session.data) {
      router.push("/")
    }
  }, [session])
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/projects/${resolvedParams.projectId}`, {
          method: "GET",
          headers: {
            "x-api-key": "thisisasdca",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })

        if (response.status === 401) {
          window.location.href = "/sign-in"
          return
        }

        const result = await response.json()
        setProject(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching project:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [resolvedParams.projectId])

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate days remaining until due date
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get color based on priority
  const getPriorityColor = (priority: string) => {
    const isDark = theme === "dark"
    switch (priority.toLowerCase()) {
      case "high":
        return isDark ? "text-red-400 bg-red-950/50" : "text-red-600 bg-red-50"
      case "medium":
        return isDark ? "text-amber-400 bg-amber-950/50" : "text-amber-600 bg-amber-50"
      case "low":
        return isDark ? "text-emerald-400 bg-emerald-950/50" : "text-emerald-600 bg-emerald-50"
      default:
        return isDark ? "text-gray-400 bg-gray-800" : "text-gray-600 bg-gray-100"
    }
  }

  // Get color based on status
  const getStatusColor = (status: string) => {
    const isDark = theme === "dark"
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return isDark
          ? "bg-green-900/50 text-green-400 border-green-800"
          : "bg-green-100 text-green-800 border-green-200"
      case "IN_PROGRESS":
        return isDark ? "bg-blue-900/50 text-blue-400 border-blue-800" : "bg-blue-100 text-blue-800 border-blue-200"
      case "ASSIGNED":
        return isDark
          ? "bg-amber-900/50 text-amber-400 border-amber-800"
          : "bg-amber-100 text-amber-800 border-amber-200"
      case "NOT_STARTED":
        return isDark ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-gray-100 text-gray-800 border-gray-200"
      case "DRAFT":
        return isDark ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return isDark ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get color based on completion status
  const getCompletionStatusColor = (status: string) => {
    const isDark = theme === "dark"
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return isDark
          ? "bg-green-900/50 text-green-400 border-green-800"
          : "bg-green-100 text-green-800 border-green-200"
      case "IN_PROGRESS":
        return isDark ? "bg-blue-900/50 text-blue-400 border-blue-800" : "bg-blue-100 text-blue-800 border-blue-200"
      case "PLANNING":
        return isDark
          ? "bg-purple-900/50 text-purple-400 border-purple-800"
          : "bg-purple-100 text-purple-800 border-purple-200"
      case "ON_HOLD":
        return isDark
          ? "bg-amber-900/50 text-amber-400 border-amber-800"
          : "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return isDark ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get initials for Avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Handle document view
  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setIsModalOpen(true)
  }

  // Handle PDF download
  const handleDownloadPDF = (doc: Document) => {
    const pdf = new jsPDF()

    // Add title
    pdf.setFontSize(16)
    pdf.text(doc.name, 20, 20)

    // Add metadata
    pdf.setFontSize(12)
    pdf.text(`Description: ${doc.description}`, 20, 30)
    pdf.text(`Created by: ${doc.createdBy}`, 20, 40)
    pdf.text(`Created: ${formatDate(doc.createdAt)}`, 20, 50)
    pdf.text(`Status: ${doc.status}`, 20, 60)

    // Add document content
    pdf.setFontSize(10)
    const bodyLines = pdf.splitTextToSize(doc.body, 170) // Split text to fit page width
    pdf.text(bodyLines, 20, 80)

    // Download the PDF
    pdf.save(`${doc.name}.pdf`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-32" /> <Skeleton className="h-32" /> <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    )
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
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto flex h-[80vh] items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-200">Project Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              The project you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter tasks based on search query and filters
  const filteredTasks =
    project?.tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter

      // Priority filter
      const matchesPriority = priorityFilter === "all" || task.priority.toLowerCase() === priorityFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesPriority
    }) || []

  // Filter documents based on search query and filters
  const filteredDocuments =
    project?.documents.filter((doc) => {
      // Search filter
      const matchesSearch =
        documentSearchQuery === "" ||
        doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(documentSearchQuery.toLowerCase())

      // Status filter
      const matchesStatus = documentStatusFilter === "all" || doc.status === documentStatusFilter

      return matchesSearch && matchesStatus
    }) || []

  return (
    <div className="container mx-auto p-6">
      {/* Project Header */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{project.name}</h1>
              <Badge className={`border ${getCompletionStatusColor(project.completionStatus)}`}>
                {project.completionStatus.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{project.description}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Badge
            variant="outline"
            className="flex items-center border-gray-300 px-3 py-1 text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span> {project.projectType}
          </Badge>
          <Badge
            variant="outline"
            className="flex items-center border-gray-300 px-3 py-1 text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            <span className="mr-1 h-2 w-2 rounded-full bg-purple-500"></span> {project.complexity} Complexity
          </Badge>
          <div className="flex items-center rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />{" "}
            <span>{project.timeEstimate} hours est.</span>
          </div>
          <div className="flex items-center rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />{" "}
            <span>Created: {formatDate(project.createdAt)}</span>
          </div>
        </div>
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Project Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {Math.round((project.tasks.filter((t) => t.status === "COMPLETED").length / project.tasks.length) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{
                width: `${Math.round((project.tasks.filter((t) => t.status === "COMPLETED").length / project.tasks.length) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-6">
        {/* Updated Tab Bar to match the image */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="flex space-x-2 bg-transparent p-0 border-none">
            <TabsTrigger
              value="tasks"
              className="rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-300"
            >
              Tasks ({project.tasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-300"
            >
              Team ({project.employeesWorkingOn.length})
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-300"
            >
              Documents ({project.documents.length})
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
            <Button variant="outline" size="sm" className="rounded-md px-4 py-2 text-sm">
              <FileText className="mr-2 h-4 w-4" />
              All Types
            </Button>
          </div>
        </div>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Project Tasks</h2>
            <div className="flex items-center space-x-2">
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="COMPLETED">Completed</option>
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
              <Button size="sm">
                <span>Add Task</span>
              </Button>
            </div>
          </div>
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {task.name}
                      </CardTitle>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div
                        className={`inline-block rounded-md border px-2 py-1 text-xs ${getStatusColor(task.status)}`}
                      >
                        {task.status.replace(/_/g, " ")}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="mr-2 h-4 w-4" /> Due: {formatDate(task.due)}
                        {getDaysRemaining(task.due) >= 0 ? (
                          <span className="ml-2 text-green-600 dark:text-green-400">
                            ({getDaysRemaining(task.due)} days left)
                          </span>
                        ) : (
                          <span className="ml-2 text-red-600 dark:text-red-400">
                            (Overdue by {Math.abs(getDaysRemaining(task.due))} days)
                          </span>
                        )}
                      </div>
                      {task.assignedTo && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Users className="mr-2 h-4 w-4" /> Assigned to: {task.assignedTo}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      {task.status === "COMPLETED" ? "Completed" : "Mark Complete"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? "Try adjusting your search or filters" : "Add a task to get started"}
              </p>
              <Button className="mt-4" size="sm">
                Add Task
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Team Members</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search team members..."
                  className="h-9 w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button size="sm">
                <span>Add Member</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.employeesWorkingOn.map((employee) => (
              <Card key={employee.id} className="border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
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
                      <span className="font-medium">Email:</span> {employee.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Location:</span> {employee.location}
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Project Documents</h2>
            <Button size="sm">
              <span>Add Document</span>
            </Button>
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
            <Button variant="outline" size="sm" className="rounded-md px-4 py-2 text-sm">
              <FileText className="mr-2 h-4 w-4" />
              All Types
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">{doc.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                    {doc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className={`inline-block rounded-md border px-2 py-1 text-xs ${getStatusColor(doc.status)}`}>
                      {doc.status.replace(/_/g, " ")}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created by: {doc.createdBy}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created: {formatDate(doc.createdAt)}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/documents/${doc.id}`)}
                  >
                    View Document
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                  onClick={() => selectedDocument && handleDownloadPDF(selectedDocument)}
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
                <span className="font-medium">Description:</span> {selectedDocument?.description}
              </p>
              <p>
                <span className="font-medium">Created by:</span> {selectedDocument?.createdBy}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {selectedDocument && formatDate(selectedDocument.createdAt)}
              </p>
              <div
                className={`inline-block mt-2 rounded-md border px-2 py-1 text-xs ${
                  selectedDocument && getStatusColor(selectedDocument.status)
                }`}
              >
                {selectedDocument?.status.replace(/_/g, " ")}
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{selectedDocument?.body}</ReactMarkdown>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


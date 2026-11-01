"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CheckCircle, ArrowUpRight, Users } from "lucide-react"

interface TaskCardProps {
  task: {
    id: string
    name: string
    description: string
    due: string | null
    status: string
    priority: string
    tag: string
    assignedTo?: string
  }
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
  formatDate: (dateString: string) => string
  getDaysRemaining: (dueDate: string | null) => number | null
  onMarkComplete: (taskId: string) => void
  onViewDetails: (taskId: string) => void
}

export default function TaskCard({
  task,
  getPriorityColor,
  getStatusColor,
  formatDate,
  getDaysRemaining,
  onMarkComplete,
  onViewDetails,
}: TaskCardProps) {
  return (
    <Card className="border-gray-200 dark:border-gray-800 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">{task.name}</CardTitle>
          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
        </div>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className={`inline-block rounded-md border px-2 py-1 text-xs ${getStatusColor(task.status)}`}>
            {task.status.replace(/_/g, " ")}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CalendarIcon className="mr-2 h-4 w-4" /> Due:{" "}
            {task.due ? formatDate(task.due) : "No due date"}
            {getDaysRemaining(task.due) !== null &&
              (getDaysRemaining(task.due)! >= 0 ? (
                <span className="ml-2 text-green-600 dark:text-green-400">({getDaysRemaining(task.due)} days left)</span>
              ) : (
                <span className="ml-2 text-red-600 dark:text-red-400">
                  (Overdue by {Math.abs(getDaysRemaining(task.due)!)} days)
                </span>
              ))}
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
          onClick={() => onMarkComplete(task.id)}
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          {task.status === "COMPLETED" ? "Completed" : "Mark Complete"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => onViewDetails(task.id)}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

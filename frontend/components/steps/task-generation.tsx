"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckSquare, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { generateTasks } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface TaskGenerationProps {
  projectData: {
    projectName: string;
    newdefinition: string;
    keyFeatures: string[];
    selectedTeamMembers: any[];
    projectDuration: number;
    tasks: any[];
  };
  updateProjectData: (
    data: Partial<{
      projectName: string;
      newdefinition: string;
      keyFeatures: string[];
      selectedTeamMembers: any[];
      projectDuration: number;
      tasks: any[];
    }>,
  ) => void;
  setIsLoading: (loading: boolean) => void;
  onComplete: () => void;
}

export function TaskGeneration({
  projectData,
  updateProjectData,
  setIsLoading,
  onComplete,
}: TaskGenerationProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added submitting state
  const [complexity, setComplexity] = useState("medium");
  const [developmentType, setDevelopmentType] = useState("Web Application");
  const [newTask, setNewTask] = useState({
    name: "",
    desc: "",
    assigned_to: "",
    priority: "Medium",
    deadline: "7",
  });

  const handleGenerateTasks = async () => {
    if (isSubmitting) return; // Prevent if already submitting

    if (projectData.selectedTeamMembers.length === 0) {
      setError("Please select team members before generating tasks");
      toast({
        title: "Missing Information",
        description: "Please select team members before generating tasks",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateTasks(
        projectData.projectName,
        projectData.newdefinition,
        projectData.keyFeatures,
        complexity,
        developmentType,
      );

      if (response.success) {
        const tasks = response.data.tasks.map((task: any) => {
          const teamMember =
            projectData.selectedTeamMembers.find((member) =>
              member.role
                .toLowerCase()
                .includes(task.assigned_to.toLowerCase()),
            ) || projectData.selectedTeamMembers[0];

          return {
            ...task,
            assigned_to: teamMember.name,
            assigned_to_id: teamMember.id,
            assigned_to_avatar: teamMember.avatar,
          };
        });

        updateProjectData({ tasks });

        toast({
          title: "Success",
          description: `Generated ${tasks.length} tasks for your project`,
          variant: "default",
        });
      } else {
        setError(response.message || "Failed to generate tasks");
        toast({
          title: "Error",
          description: response.message || "Failed to generate tasks",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An error occurred while generating tasks");
      console.error(err);
      toast({
        title: "Error",
        description: "An error occurred while generating tasks",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    if (isSubmitting) return; // Prevent if submitting

    if (!newTask.name || !newTask.desc || !newTask.assigned_to) {
      setError("Please fill in all required fields");
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const teamMember = projectData.selectedTeamMembers.find(
      (member) => member.id === newTask.assigned_to,
    );

    if (!teamMember) {
      setError("Please select a valid team member");
      return;
    }

    const updatedTasks = [
      ...projectData.tasks,
      {
        ...newTask,
        assigned_to: teamMember.name,
        assigned_to_id: teamMember.id,
        assigned_to_avatar: teamMember.avatar,
        required_skills: [],
      },
    ];

    updateProjectData({ tasks: updatedTasks });
    setIsAddTaskDialogOpen(false);
    setNewTask({
      name: "",
      desc: "",
      assigned_to: "",
      priority: "Medium",
      deadline: "7",
    });

    toast({
      title: "Task Added",
      description: `Task "${newTask.name}" has been added to the project`,
      variant: "default",
    });
  };

  const handleRemoveTask = (index: number) => {
    if (isSubmitting) return; // Prevent if submitting

    const updatedTasks = [...projectData.tasks];
    updatedTasks.splice(index, 1);
    updateProjectData({ tasks: updatedTasks });

    toast({
      title: "Task Removed",
      description: "Task has been removed from the project",
      variant: "default",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {projectData.tasks.length === 0 ? (
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                Task Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complexity">Project Complexity</Label>
                  <Select
                    value={complexity}
                    onValueChange={setComplexity}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="complexity"
                      className="border-slate-200 dark:border-slate-700"
                    >
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="developmentType">Development Type</Label>
                  <Select
                    value={developmentType}
                    onValueChange={setDevelopmentType}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="developmentType"
                      className="border-slate-200 dark:border-slate-700"
                    >
                      <SelectValue placeholder="Select development type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Application">
                        Web Application
                      </SelectItem>
                      <SelectItem value="Mobile Application">
                        Mobile Application
                      </SelectItem>
                      <SelectItem value="Desktop Application">
                        Desktop Application
                      </SelectItem>
                      <SelectItem value="API/Backend">API/Backend</SelectItem>
                      <SelectItem value="Full Stack">Full Stack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Selected Team Members (
                  {projectData.selectedTeamMembers.length})
                </Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
                  {projectData.selectedTeamMembers.length > 0 ? (
                    projectData.selectedTeamMembers.map((member) => (
                      <Badge
                        key={member.id}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-slate-200 text-slate-700 text-xs dark:bg-slate-700 dark:text-slate-200">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </Badge>
                    ))
                  ) : (
                    <div className="w-full text-center text-muted-foreground py-2">
                      No team members selected. Please go back to the Team
                      Selection step.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-md border-slate-300 dark:border-slate-700">
            <CheckSquare className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="text-lg font-medium mb-3 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Generate Project Tasks
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Based on your project definition, key features, and selected team
              members, we'll generate tasks for your project.
            </p>
            <Button
              onClick={handleGenerateTasks}
              className="min-w-[200px] bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
              disabled={
                projectData.selectedTeamMembers.length === 0 || isSubmitting
              }
            >
              {isSubmitting ? "Generating..." : "Generate Tasks"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Project Tasks
            </h3>
            <div className="flex gap-2">
              <Dialog
                open={isAddTaskDialogOpen}
                onOpenChange={setIsAddTaskDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    disabled={isSubmitting}
                    className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                      Add New Task
                    </DialogTitle>
                    <DialogDescription>
                      Create a new task for your project.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-name">Task Name</Label>
                      <Input
                        id="task-name"
                        value={newTask.name}
                        onChange={(e) =>
                          setNewTask({ ...newTask, name: e.target.value })
                        }
                        placeholder="Enter task name"
                        disabled={isSubmitting}
                        className="border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-desc">Description</Label>
                      <Textarea
                        id="task-desc"
                        value={newTask.desc}
                        onChange={(e) =>
                          setNewTask({ ...newTask, desc: e.target.value })
                        }
                        placeholder="Describe the task"
                        rows={3}
                        disabled={isSubmitting}
                        className="border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="task-priority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) =>
                            setNewTask({ ...newTask, priority: value })
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="border-slate-200 dark:border-slate-700">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="task-deadline">Deadline (days)</Label>
                        <Input
                          id="task-deadline"
                          type="number"
                          min="1"
                          max={projectData.projectDuration.toString()}
                          value={newTask.deadline}
                          onChange={(e) =>
                            setNewTask({ ...newTask, deadline: e.target.value })
                          }
                          disabled={isSubmitting}
                          className="border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-assigned">Assigned To</Label>
                      <Select
                        value={newTask.assigned_to}
                        onValueChange={(value) =>
                          setNewTask({ ...newTask, assigned_to: value })
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="border-slate-200 dark:border-slate-700">
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectData.selectedTeamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddTaskDialogOpen(false)}
                      disabled={isSubmitting}
                      className="border-slate-200 dark:border-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddTask}
                      disabled={isSubmitting}
                      className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      Add Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="font-medium">Task</TableHead>
                    <TableHead className="font-medium">Assigned To</TableHead>
                    <TableHead className="font-medium">Priority</TableHead>
                    <TableHead className="font-medium">Deadline</TableHead>
                    <TableHead className="font-medium w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectData.tasks.map((task, index) => (
                    <TableRow
                      key={index}
                      className="border-slate-200 dark:border-slate-700"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {task.desc}
                          </div>
                          {task.required_skills &&
                            task.required_skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.required_skills.map(
                                  (skill: string, i: number) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs border-slate-200 dark:border-slate-700"
                                    >
                                      {skill}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-slate-200 text-slate-700 text-xs dark:bg-slate-700 dark:text-slate-200">
                              {task.assigned_to_avatar ||
                                task.assigned_to.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{task.assigned_to}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.deadline} days</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTask(index)}
                          className="h-8 w-8"
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Button
            onClick={onComplete}
            className="w-full mt-6 h-11 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
            disabled={isSubmitting}
          >
            Accept Tasks and Continue
          </Button>
        </div>
      )}
    </div>
  );
}

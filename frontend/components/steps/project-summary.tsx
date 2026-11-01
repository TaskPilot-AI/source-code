"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle2,
  FileText,
  ListChecks,
  Sparkles,
  Calendar,
  Users,
} from "lucide-react";
import { useEffect } from "react";

interface ProjectSummaryProps {
  projectData: {
    projectName: string;
    newdefinition: string;
    keyFeatures: string[];
    document: any;
    selectedTeamMembers: any[];
    projectDuration: number;
    tasks: any[];
  };
}

export function ProjectSummary({ projectData }: ProjectSummaryProps) {
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

  // Calculate project timeline
  const startDate = new Date();
  const endDate = new Date(
    startDate.getTime() + projectData.projectDuration * 24 * 60 * 60 * 1000,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-slate-600 dark:text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
            Project Ready!
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your project has been successfully created and is ready to be
            finalized. Review the details below to ensure everything is correct.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Project Overview
            </CardTitle>
          </div>
          <CardDescription>Summary of your project details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Project Name
            </h3>
            <p className="text-xl font-semibold pl-4 border-l-2 border-slate-400 dark:border-slate-600">
              {projectData.projectName}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Project Definition
            </h3>
            <p className="pl-4 border-l-2 border-slate-400 dark:border-slate-600 leading-relaxed">
              {projectData.newdefinition}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Key Features
            </h3>
            <div className="flex flex-wrap gap-2 mt-2 pl-4 border-l-2 border-slate-400 dark:border-slate-600">
              {projectData.keyFeatures.map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Project Timeline
            </h3>
            <div className="pl-4 border-l-2 border-slate-400 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Duration:</span>{" "}
                {projectData.projectDuration} days
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Start Date:</span>{" "}
                {startDate.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Estimated Completion:</span>{" "}
                {endDate.toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Team Members
            </CardTitle>
          </div>
          <CardDescription>Project team composition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectData.selectedTeamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 border rounded-md border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.role} • {member.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Documentation
            </CardTitle>
          </div>
          <CardDescription>Generated project documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border rounded-md bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
            <h3 className="font-medium text-lg mb-3 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              {projectData.document.doc_name}
            </h3>
            <p className="text-muted-foreground mb-4">
              {projectData.document.doc_desc}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm">
                  <span className="font-medium">Sections:</span>{" "}
                  {projectData.document.doc_body.length} main sections
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm">
                  <span className="font-medium">Diagrams:</span> Entity
                  Relationship Diagram, Use Case Diagram
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm">
                  <span className="font-medium">Requirements:</span> Functional
                  and Non-functional requirements
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Tasks
            </CardTitle>
          </div>
          <CardDescription>
            Generated project tasks ({projectData.tasks.length})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-700">
                <TableHead className="font-medium">Task</TableHead>
                <TableHead className="font-medium">Assigned To</TableHead>
                <TableHead className="font-medium">Priority</TableHead>
                <TableHead className="font-medium">Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectData.tasks.map((task, index) => (
                <TableRow
                  key={index}
                  className="border-slate-200 dark:border-slate-700"
                >
                  <TableCell>
                    <div className="font-medium">{task.name}</div>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {task.desc}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

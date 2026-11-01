"use client";

import { useState, useEffect } from "react";
import { ProjectDefinition } from "@/components/steps/project-definition";
import { KeyFeatures } from "@/components/steps/key-features";
import { DocumentGeneration } from "@/components/steps/document-generation";
import { TeamSelection } from "@/components/steps/team-selection";
import { TaskGeneration } from "@/components/steps/task-generation";
import { ProjectSummary } from "@/components/steps/project-summary";
import { StepIndicator } from "@/components/step-indicator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { fetchEmployees } from "@/lib/api";
import { API_URL } from "@/app/lib/server-config";

const STEPS = [
  "Project Definition",
  "Key Features",
  "Documentation",
  "Team Selection",
  "Task Generation",
  "Summary",
];

export function ProjectCreationWizard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for final submission
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projectData, setProjectData] = useState({
    projectName: "",
    definition: "",
    newdefinition: "",
    keyFeatures: [] as string[],
    document: null as any,
    selectedTeamMembers: [] as any[],
    tasks: [] as any[],
    projectDuration: 30,
  });

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await fetchEmployees();

        if (response.success && Array.isArray(response.data)) {
          const formattedEmployees = response.data.map((employee: any) => ({
            id: employee.id,
            name: employee.name,
            role: employee.role || "Team Member",
            department: employee.department || "General",
            avatar: employee.name
              .split(" ")
              .map((n: string) => n[0])
              .join(""),
            selected: false,
          }));

          setTeamMembers(formattedEmployees);
        } else {
          console.warn("API returned no data or invalid format");
          setTeamMembers([]);
          toast({
            title: "Warning",
            description:
              "Could not load team members. You may need to add them later.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load team members");
        toast({
          title: "Error",
          description: "Failed to load team members. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getEmployees();
  }, [toast]);

  const handleCreateProject = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    setIsLoading(true);
    setError(null);

    try {
      if (!localStorage.getItem("adminId")) {
        throw new Error("Admin ID not found");
      }

      const response = await fetch(`${API_URL}/projects/create-project`, {
        method: "POST",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          projectName: projectData.projectName,
          definition: projectData.definition,
          selectedTeamMembers: projectData.selectedTeamMembers,
          document: projectData.document,
          tasks: projectData.tasks,
          projectDuration: projectData.projectDuration,
          ownerId: localStorage.getItem("adminId"),
          newdefinition: projectData.newdefinition,
        }),
      });

      if (response.status === 401) {
        // window.location.href = "/";
        toast({
          title: "Unauthorized",
          description: "Please log in again",
          variant: "destructive",
        });
        setIsSubmitting(false);
        setIsLoading(false);
        return;
      }
      const data = await response.json();

      if (response.status === 400 && data.error === "Subscription is pending") {
        toast({
          title: "Subscription Pending",
          description:
            "Your subscription is pending. Please check your payment status.",
          variant: "destructive",
        });
        throw new Error("You have reached your project limit");
      }

      if (
        response.status === 400 &&
        data.error === "You have reached your project limit"
      ) {
        toast({
          title: "Limit Reached",
          description: "You have reached your project limit.",
          variant: "destructive",
        });
        throw new Error("You have reached your project limit");
      }

      if (!response.ok) {
        throw new Error(`Failed to create project: ${response.status}`);
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Project created successfully",
          variant: "default",
        });
        window.location.href = `/projects/${data.data.id}`;
      } else {
        throw new Error(`Failed to create project: ${data.message}`);
      }
    } catch (err) {
      // You have reached your project limit
      if (
        err instanceof Error &&
        err.message.includes("You have reached your project limit")
      ) {
        toast({
          title: "Limit Reached",
          description: "You have reached your project limit.",
          variant: "destructive",
        });
        return;
      } else {
        console.error("Error creating project:", err);
        setError(
          err instanceof Error ? err.message : "Failed to create project",
        );
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      if (
        currentStep === 0 &&
        (!projectData.projectName || !projectData.newdefinition)
      ) {
        toast({
          title: "Missing Information",
          description: "Please provide both project name and definition",
          variant: "destructive",
        });
        return;
      }

      if (
        currentStep === 1 &&
        (!projectData.keyFeatures || projectData.keyFeatures.length === 0)
      ) {
        toast({
          title: "Missing Information",
          description: "Please add at least one key feature",
          variant: "destructive",
        });
        return;
      }

      if (currentStep === 2 && !projectData.document) {
        toast({
          title: "Missing Information",
          description: "Please generate project documentation",
          variant: "destructive",
        });
        return;
      }

      if (
        currentStep === 3 &&
        (!projectData.selectedTeamMembers ||
          projectData.selectedTeamMembers.length === 0)
      ) {
        toast({
          title: "Missing Information",
          description: "Please select at least one team member",
          variant: "destructive",
        });
        return;
      }

      if (
        currentStep === 4 &&
        (!projectData.tasks || projectData.tasks.length === 0)
      ) {
        toast({
          title: "Missing Information",
          description: "Please generate tasks for your project",
          variant: "destructive",
        });
        return;
      }

      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Completed",
        description: `${STEPS[currentStep]} completed successfully`,
        variant: "default",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProjectData = (data: Partial<typeof projectData>) => {
    setProjectData({ ...projectData, ...data });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectDefinition
            projectData={projectData}
            updateProjectData={updateProjectData}
            setIsLoading={setIsLoading}
            onComplete={handleNext}
          />
        );
      case 1:
        return (
          <KeyFeatures
            projectData={projectData}
            updateProjectData={updateProjectData}
            setIsLoading={setIsLoading}
            onComplete={handleNext}
          />
        );
      case 2:
        return (
          <DocumentGeneration
            projectData={projectData}
            updateProjectData={updateProjectData}
            setIsLoading={setIsLoading}
            onComplete={handleNext}
          />
        );
      case 3:
        return (
          <TeamSelection
            projectData={projectData}
            teamMembers={teamMembers}
            updateProjectData={updateProjectData}
            setIsLoading={setIsLoading}
            onComplete={handleNext}
          />
        );
      case 4:
        return (
          <TaskGeneration
            projectData={projectData}
            updateProjectData={updateProjectData}
            setIsLoading={setIsLoading}
            onComplete={handleNext}
          />
        );
      case 5:
        return <ProjectSummary projectData={projectData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
          Create New Project
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Follow the steps below to create a new project using our AI-powered
          project generation system. Each step builds upon the previous one to
          create a comprehensive project plan.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10"
      >
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </motion.div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-slate-200 dark:border-slate-800 shadow-lg transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
            <CardHeader className="pb-4 border-b bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CardTitle className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                  {STEPS[currentStep]}
                </CardTitle>
                {isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <CardDescription className="text-base">
                {currentStep === 0 &&
                  "Define your project by providing a name and description."}
                {currentStep === 1 &&
                  "Review and edit the key features identified for your project."}
                {currentStep === 2 &&
                  "Generate comprehensive project documentation based on your requirements."}
                {currentStep === 3 &&
                  "Select team members who will work on this project."}
                {currentStep === 4 &&
                  "Generate tasks and assign them to selected team members."}
                {currentStep === 5 &&
                  "Review your project details before finalizing."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">{renderStep()}</CardContent>
            <CardFooter className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isLoading || isSubmitting}
                className="min-w-[100px] border-slate-200 dark:border-slate-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 0 &&
                      (!projectData.projectName ||
                        !projectData.newdefinition)) ||
                    (currentStep === 1 &&
                      (!projectData.keyFeatures ||
                        projectData.keyFeatures.length === 0)) ||
                    (currentStep === 2 && !projectData.document) ||
                    (currentStep === 3 &&
                      (!projectData.selectedTeamMembers ||
                        projectData.selectedTeamMembers.length === 0)) ||
                    (currentStep === 4 &&
                      (!projectData.tasks || projectData.tasks.length === 0)) ||
                    isLoading ||
                    isSubmitting
                  }
                  className="min-w-[100px] bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleCreateProject}
                  className="min-w-[150px] bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                  disabled={isLoading || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Finalize Project
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

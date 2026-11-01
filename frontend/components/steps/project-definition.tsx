"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import { initializeProject } from "@/lib/api";

interface ProjectDefinitionProps {
  projectData: {
    projectName: string;
    definition: string;
    newdefinition: string;
  };
  updateProjectData: (
    data: Partial<ProjectDefinitionProps["projectData"]>,
  ) => void;
  setIsLoading: (loading: boolean) => void;
  onComplete: () => void;
}

export function ProjectDefinition({
  projectData,
  updateProjectData,
  setIsLoading,
  onComplete,
}: ProjectDefinitionProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added local submitting state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectData.projectName || !projectData.definition) {
      setError("Please provide both project name and definition");
      return;
    }

    if (isSubmitting) return; // Prevent submission if already submitting

    setIsSubmitting(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await initializeProject(
        projectData.projectName,
        projectData.definition,
      );

      if (response.success) {
        updateProjectData({
          newdefinition: response.data.new_definition,
        });
      } else {
        setError(response.message || "Failed to initialize project");
      }
    } catch (err) {
      setError("An error occurred while initializing the project");
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label
          htmlFor="projectName"
          className="text-base font-medium bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400"
        >
          Project Name
        </Label>
        <Input
          id="projectName"
          value={projectData.projectName}
          onChange={(e) => updateProjectData({ projectName: e.target.value })}
          placeholder="Enter project name"
          required
          className="h-11 border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
          disabled={isSubmitting} // Disable input during submission
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="definition"
          className="text-base font-medium bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400"
        >
          Project Definition
        </Label>
        <Textarea
          id="definition"
          value={projectData.definition}
          onChange={(e) => updateProjectData({ definition: e.target.value })}
          placeholder="Describe your project in detail..."
          rows={5}
          required
          className="resize-y min-h-[120px] border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500"
          disabled={isSubmitting} // Disable textarea during submission
        />
        <p className="text-sm text-muted-foreground">
          Provide a clear description of what you want to build. Include the
          purpose, target users, and key functionality.
        </p>
      </div>

      {projectData.newdefinition && (
        <div className="space-y-2 p-6 border rounded-md bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <Label className="text-base font-medium bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Enhanced Definition
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => updateProjectData({ newdefinition: "" })}
              disabled={isSubmitting} // Disable regenerate button during submission
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
          <Textarea
            value={projectData.newdefinition}
            onChange={(e) =>
              updateProjectData({ newdefinition: e.target.value })
            }
            rows={6}
            className="resize-y min-h-[150px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
            disabled={isSubmitting} // Disable textarea during submission
          />
          <p className="text-sm text-muted-foreground mt-2">
            This is an AI-enhanced version of your project definition. You can
            edit it if needed.
          </p>

          <Button
            type="button"
            onClick={onComplete}
            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
            disabled={isSubmitting} // Disable continue button during submission
          >
            Accept and Continue
          </Button>
        </div>
      )}

      {!projectData.newdefinition && (
        <Button
          type="submit"
          className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
          disabled={isSubmitting} // Disable submit button during submission
        >
          {isSubmitting ? "Generating..." : "Generate Enhanced Definition"}
        </Button>
      )}
    </form>
  );
}

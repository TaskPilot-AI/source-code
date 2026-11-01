"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RefreshCw, X } from "lucide-react";
import { identifyKeyFeatures } from "@/lib/api";

interface KeyFeaturesProps {
  projectData: {
    projectName: string;
    newdefinition: string;
    keyFeatures: string[];
  };
  updateProjectData: (data: Partial<KeyFeaturesProps["projectData"]>) => void;
  setIsLoading: (loading: boolean) => void;
  onComplete: () => void;
}

export function KeyFeatures({
  projectData,
  updateProjectData,
  setIsLoading,
  onComplete,
}: KeyFeaturesProps) {
  const [error, setError] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Added submitting state

  const handleGenerateFeatures = async () => {
    if (isSubmitting) return; // Prevent if already submitting

    setIsSubmitting(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await identifyKeyFeatures(projectData.newdefinition);

      if (response.success) {
        updateProjectData({
          keyFeatures: response.data.key_features,
        });
      } else {
        setError(response.message || "Failed to identify key features");
      }
    } catch (err) {
      setError("An error occurred while identifying key features");
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !isSubmitting) {
      // Only add if not submitting
      updateProjectData({
        keyFeatures: [...projectData.keyFeatures, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (isSubmitting) return; // Prevent removal during submission

    const updatedFeatures = [...projectData.keyFeatures];
    updatedFeatures.splice(index, 1);
    updateProjectData({ keyFeatures: updatedFeatures });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label className="text-base font-medium bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
              Project Definition
            </Label>
            <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50">
              <p className="text-sm leading-relaxed">
                {projectData.newdefinition}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
            Key Features
          </Label>
          {projectData.keyFeatures.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateFeatures}
              disabled={isSubmitting}
              className="border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isSubmitting ? "Generating..." : "Regenerate"}
            </Button>
          )}
        </div>

        {projectData.keyFeatures.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-md border-slate-300 dark:border-slate-700">
            <p className="text-muted-foreground mb-4 text-center">
              Based on your project definition, we'll identify the key features
              for your project
            </p>
            <Button
              onClick={handleGenerateFeatures}
              className="min-w-[200px] bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Generate Key Features"}
            </Button>
          </div>
        ) : (
          <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {projectData.keyFeatures.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    {feature}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-2 p-0"
                      onClick={() => handleRemoveFeature(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a new feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSubmitting) {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="h-11"
                  disabled={isSubmitting}
                />
                <Button
                  onClick={handleAddFeature}
                  type="button"
                  className="h-11 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <Button
                onClick={onComplete}
                className="w-full mt-4 h-11 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                disabled={isSubmitting}
              >
                Continue with Selected Features
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

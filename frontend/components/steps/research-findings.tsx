"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, ExternalLink, Plus, Check, X } from "lucide-react";
import { conductResearch } from "@/lib/api";

interface ResearchFindingsProps {
  projectData: {
    projectName: string;
    newdefinition: string;
    keyFeatures: string[];
    document: any;
    researchFindings?: {
      query: string;
      results: Array<{
        title: string;
        url: string;
        content: string;
        score: number;
        selected?: boolean;
      }>;
      selectedInsights: string[];
    };
  };
  updateProjectData: (
    data: Partial<ResearchFindingsProps["projectData"]>,
  ) => void;
  setIsLoading: (loading: boolean) => void;
  onComplete: () => void;
}

export function ResearchFindings({
  projectData,
  updateProjectData,
  setIsLoading,
  onComplete,
}: ResearchFindingsProps) {
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState("");
  const [activeTab, setActiveTab] = useState("results");

  const handleConductResearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the research API
      const response = await conductResearch(projectData.newdefinition);

      if (response.success) {
        // Add a selected property to each result
        const resultsWithSelection = response.data.results.map(
          (result: any) => ({
            ...result,
            selected: false,
          }),
        );

        updateProjectData({
          researchFindings: {
            query: response.data.query,
            results: resultsWithSelection,
            selectedInsights: [],
          },
        });
      } else {
        setError(response.message || "Failed to conduct research");
      }
    } catch (err) {
      setError("An error occurred while conducting research");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleResult = (index: number) => {
    if (!projectData.researchFindings) return;

    const updatedResults = [...projectData.researchFindings.results];
    updatedResults[index].selected = !updatedResults[index].selected;

    updateProjectData({
      researchFindings: {
        ...projectData.researchFindings,
        results: updatedResults,
      },
    });
  };

  const handleAddInsight = () => {
    if (!insight.trim() || !projectData.researchFindings) return;

    const updatedInsights = [
      ...(projectData.researchFindings.selectedInsights || []),
    ];
    updatedInsights.push(insight.trim());

    updateProjectData({
      researchFindings: {
        ...projectData.researchFindings,
        selectedInsights: updatedInsights,
      },
    });

    setInsight("");
  };

  const handleRemoveInsight = (index: number) => {
    if (!projectData.researchFindings) return;

    const updatedInsights = [...projectData.researchFindings.selectedInsights];
    updatedInsights.splice(index, 1);

    updateProjectData({
      researchFindings: {
        ...projectData.researchFindings,
        selectedInsights: updatedInsights,
      },
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!projectData.researchFindings ? (
        <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-md">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-3">Conduct Project Research</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Based on your project definition and key features, we'll research
            similar projects and best practices to enhance your project plan.
          </p>
          <Button onClick={handleConductResearch} className="min-w-[200px]">
            Start Research
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl">Research Findings</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Based on your project definition, we've found relevant resources
                and insights to help guide your project development.
              </p>
            </CardHeader>
          </Card>

          <Tabs
            defaultValue="results"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6 w-full">
              <TabsTrigger value="results" className="text-sm">
                Research Results
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-sm">
                Key Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Query</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/30 rounded-md border">
                    <p className="whitespace-pre-line text-sm">
                      {projectData.researchFindings.query}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {projectData.researchFindings.results.map((result, index) => (
                  <Card
                    key={index}
                    className={`border transition-colors ${
                      result.selected
                        ? "border-primary/50 bg-primary/5"
                        : "hover:border-muted-foreground/30"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-base line-clamp-1">
                          {result.title}
                        </h3>
                        <Button
                          variant={result.selected ? "default" : "outline"}
                          size="sm"
                          className="ml-2 shrink-0"
                          onClick={() => handleToggleResult(index)}
                        >
                          {result.selected ? (
                            <>
                              <Check className="h-4 w-4 mr-1" /> Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {result.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          Relevance: {Math.round(result.score * 100)}%
                        </Badge>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center text-primary hover:underline"
                        >
                          View Source <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={insight}
                      onChange={(e) => setInsight(e.target.value)}
                      placeholder="Add a key insight from your research..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInsight();
                        }
                      }}
                    />
                    <Button onClick={handleAddInsight} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>

                  {projectData.researchFindings.selectedInsights.length ===
                  0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-md">
                      <BookOpen className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        No insights added yet. Select research findings or add
                        your own insights.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {projectData.researchFindings.selectedInsights.map(
                        (insight, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/20 rounded-md border"
                          >
                            <span className="text-sm">{insight}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveInsight(index)}
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Remove</span>
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        ),
                      )}
                    </ul>
                  )}

                  <div className="pt-4">
                    <Button onClick={onComplete} className="w-full">
                      Apply Insights and Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, AlertTriangle, Info } from "lucide-react";
import { generateDocument } from "@/lib/api";
import MermaidDiagram from "../mermaid-component";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocumentGenerationProps {
  projectData: {
    projectName: string;
    newdefinition: string;
    keyFeatures: string[];
    document: any;
  };
  updateProjectData: (
    data: Partial<DocumentGenerationProps["projectData"]>,
  ) => void;
  setIsLoading: (loading: boolean) => void;
  onComplete: () => void;
}

// FormattedTitle component with improved bold handling
const FormattedTitle = ({ title }: { title: string }) => {
  // Split the title by ** markers and process each part
  const parts = title.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className="flex items-baseline gap-1">
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const boldText = part.slice(2, -2);
          return (
            <span
              key={index}
              className="font-bold text-slate-600 dark:text-slate-300"
            >
              {boldText}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export function DocumentGeneration({
  projectData,
  updateProjectData,
  setIsLoading,
  onComplete,
}: DocumentGenerationProps) {
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false); // Added submitting state
  const [diagramErrors, setDiagramErrors] = useState<{
    er?: boolean;
    useCase?: boolean;
  }>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handleGenerateDocument = async () => {
    if (isSubmitting) return; // Prevent if already submitting

    setIsSubmitting(true);
    setIsLoading(true);
    setError(null);
    setMissingFields([]);
    try {
      const response = await generateDocument(
        projectData.projectName,
        projectData.newdefinition,
        projectData.keyFeatures,
      );

      if (response.success) {
        const emptyFields: string[] = [];
        if (!response.data.doc_name) emptyFields.push("Document Name");
        if (!response.data.doc_desc) emptyFields.push("Document Description");
        if (!response.data.er_diagram) emptyFields.push("ER Diagram");
        if (
          !response.data.doc_body ||
          Object.keys(response.data.doc_body).length === 0
        ) {
          emptyFields.push("Document Content");
        }

        setMissingFields(emptyFields);

        const processedData = {
          ...response.data,
          doc_name:
            response.data.doc_name ||
            projectData.projectName + " Documentation",
          doc_desc:
            response.data.doc_desc ||
            "Generated documentation for " + projectData.projectName,
          doc_body:
            response.data.doc_body &&
            Object.keys(response.data.doc_body).length > 0
              ? response.data.doc_body
              : [
                  {
                    section: "Project Overview",
                    content: [
                      {
                        subsection: "Description",
                        content: projectData.newdefinition,
                      },
                      {
                        subsection: "Key Features",
                        content: projectData.keyFeatures.map((feature) => ({
                          subsubsection: "",
                          content: feature,
                        })),
                      },
                    ],
                  },
                ],
        };

        updateProjectData({
          document: processedData,
        });
      } else {
        setError(response.message || "Failed to generate document");
      }
    } catch (err) {
      setError("An error occurred while generating the document");
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleDiagramError = (type: "er" | "useCase", hasError: boolean) => {
    setDiagramErrors((prev) => ({
      ...prev,
      [type]: hasError,
    }));
  };

  const hasDiagramIssues = (diagram: string): boolean => {
    if (!diagram) return true;
    const hasInvalidSyntax =
      diagram.includes("[pk]") || diagram.includes("-----------------------^");
    return hasInvalidSyntax;
  };

  const renderDocumentSection = (section: any) => {
    if (!section) return null;

    return (
      <div key={section.section} className="mb-8">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
          {section.section}
        </h3>
        {Array.isArray(section.content) &&
          section.content.map((subsection: any, index: number) => (
            <div
              key={index}
              className="mb-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700"
            >
              {subsection.subsection && (
                <h4 className="text-md font-medium mb-3">
                  <FormattedTitle title={subsection.subsection} />
                </h4>
              )}
              {typeof subsection.content === "string" ? (
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {subsection.content}
                  </ReactMarkdown>
                </p>
              ) : Array.isArray(subsection.content) ? (
                subsection.content.map((subsubsection: any, idx: number) => (
                  <div
                    key={idx}
                    className="mb-4 pl-3 border-l border-slate-200 dark:border-slate-700"
                  >
                    {subsubsection.subsubsection && (
                      <h5 className="text-sm font-medium mb-2">
                        <FormattedTitle title={subsubsection.subsubsection} />
                      </h5>
                    )}
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {subsubsection.content}
                      </ReactMarkdown>
                    </p>
                  </div>
                ))
              ) : null}
            </div>
          ))}
      </div>
    );
  };

  const erDiagramHasIssues =
    !projectData.document?.er_diagram ||
    hasDiagramIssues(projectData.document.er_diagram);

  const useCaseDiagramHasIssues =
    !projectData.document?.use_case_diagram ||
    hasDiagramIssues(projectData.document.use_case_diagram);

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {missingFields.length > 0 && (
        <Alert
          variant="destructive"
          className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2" />
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            The following sections were missing from the API response and have
            been filled with default content: {missingFields.join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {!projectData.document ? (
        <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-md border-slate-300 dark:border-slate-700">
          <FileText className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-lg font-medium mb-3 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
            Generate Project Documentation
          </h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Based on your project definition and key features, we'll generate
            comprehensive documentation for your project.
          </p>
          <Button
            onClick={handleGenerateDocument}
            className="min-w-[200px] bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Generate Documentation"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
              <CardTitle className="text-xl bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                {projectData.document.doc_name ||
                  projectData.projectName + " Documentation"}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {projectData.document.doc_desc ||
                  "Generated documentation for " + projectData.projectName}
              </CardDescription>
            </CardHeader>
          </Card>
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6 w-full bg-slate-100 dark:bg-slate-800/50">
              <TabsTrigger
                value="overview"
                className="text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
                disabled={isSubmitting}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="diagrams"
                className="text-sm relative data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
                disabled={isSubmitting}
              >
                Diagrams
                {(erDiagramHasIssues || useCaseDiagramHasIssues) && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-4 h-4 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
                disabled={isSubmitting}
              >
                Detailed Content
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                    Project Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2 text-slate-600 dark:text-slate-300">
                        Project Name
                      </h4>
                      <p className="pl-4 border-l-2 border-slate-300 dark:border-slate-600">
                        {projectData.projectName}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-slate-600 dark:text-slate-300">
                        Project Definition
                      </h4>
                      <p className="pl-4 border-l-2 border-slate-300 dark:border-slate-600 leading-relaxed">
                        {projectData.newdefinition}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-slate-600 dark:text-slate-300">
                        Key Features
                      </h4>
                      <ul className="list-disc pl-8 space-y-1 border-l-2 border-slate-300 dark:border-slate-600">
                        {projectData.keyFeatures.map((feature, index) => (
                          <li key={index} className="leading-relaxed">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="diagrams" className="space-y-6">
              {!projectData.document.er_diagram ? (
                <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                      Entity Relationship Diagram
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-md overflow-auto border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                      <p className="text-muted-foreground">
                        ER Diagram was not generated by the API
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                      Entity Relationship Diagram
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    <div className="bg-white dark:bg-slate-950 rounded-md overflow-auto border border-slate-200 dark:border-slate-700 p-4">
                      <MermaidDiagram chart={projectData.document.er_diagram} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {!projectData.document.use_case_diagram ? (
                <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                      Use Case Diagram
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-md overflow-auto border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                      <p className="text-muted-foreground">
                        Use Case Diagram was not generated by the API
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                      Use Case Diagram
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    <div className="bg-white dark:bg-slate-950 rounded-md overflow-auto border border-slate-200 dark:border-slate-700 p-4">
                      <MermaidDiagram
                        chart={projectData.document.use_case_diagram}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="details" className="space-y-4">
              <Card className="border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
                    Document Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto pr-6">
                  {Array.isArray(projectData.document.doc_body) ? (
                    projectData.document.doc_body.map((section: any) =>
                      renderDocumentSection(section),
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Info className="h-10 w-10 text-slate-400 mb-4" />
                      <p className="text-muted-foreground">
                        Using basic document structure based on project
                        information
                      </p>
                      <div className="mt-6 w-full">
                        {renderDocumentSection({
                          section: "Project Overview",
                          content: [
                            {
                              subsection: "Description",
                              content: projectData.newdefinition,
                            },
                            {
                              subsection: "Key Features",
                              content: projectData.keyFeatures.map(
                                (feature) => ({
                                  subsubsection: "",
                                  content: feature,
                                }),
                              ),
                            },
                          ],
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Button
            onClick={onComplete}
            className="w-full mt-6 h-11 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
            disabled={isSubmitting}
          >
            Accept Documentation and Continue
          </Button>
        </div>
      )}
    </div>
  );
}

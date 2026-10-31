"use client";

import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  MoreHorizontal,
  Eye,
  Calendar,
  User,
  Clock,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { API_URL } from "@/app/lib/server-config";
import { formatISODate } from "@/app/lib/date_formater";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "@/components/ui/use-toast"; // Assuming you have a toast component for error messages

interface Document {
  id: string;
  name: string;
  description: string;
  status: string;
  body: string | null;
  docBody?: string;
  erDiagram?: string;
  useCaseDiagram?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  project: {
    id: string;
    name: string;
    description: string;
    projectType: string;
    complexity: string;
    completionStatus: string;
    ownerId: string;
  };
}

interface Section {
  section: string;
  content: Array<{
    subsection?: string;
    content?:
      | string
      | Array<{
          subsubsection?: string;
          content: string;
        }>;
  }>;
}

const DocumentStatus = {
  DRAFT: "DRAFT",
  REVIEW: "REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
};

export default function DocumentsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [documents, setDocuments] = useState<Document[]>([]);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.data) {
      router.push("/");
    }
  }, [session]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.project.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || doc.project.projectType === typeFilter;
    const matchesTab =
      activeTab === "all" ||
      activeTab === doc.project.name.toLowerCase().replace(/\s+/g, "-");

    return matchesSearch && matchesType && matchesTab;
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `${API_URL}/documents/project/${localStorage.getItem("adminId")}`,
          {
            method: "GET",
            headers: {
              "x-api-key": "thisisasdca",
              "Content-Type": "application/json",
              Authorization: `Authorization ${localStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );
        if (response.status === 401) {
          window.location.href = "/sign-in";
          return;
        }
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch documents");
        }
        const mappedDocuments = data.data.map((doc: any) => ({
          id: doc.id,
          name: doc.name || `Document ${doc.id}`,
          description: doc.description || "",
          status: doc.status || DocumentStatus.DRAFT,
          body: doc.body || null,
          docBody: doc.docBody || "",
          erDiagram: doc.erDiagram || "",
          useCaseDiagram: doc.useCaseDiagram || "",
          createdBy: doc.createdBy || "Unknown",
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt || doc.createdAt,
          views: doc.views || 0,
          project: {
            id: doc.project?.id || "",
            name: doc.project?.name || "Unknown Project",
            description: doc.project?.description || "",
            projectType: doc.project?.projectType || "Unknown",
            complexity: doc.project?.complexity || "Unknown",
            completionStatus: doc.project?.completionStatus || "NOT_STARTED",
            ownerId: doc.project?.ownerId || "",
          },
        }));
        setDocuments(mappedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to fetch documents. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchDocuments();
  }, []);

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/documents/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": "thisisasdca",
          "Content-Type": "application/json",
          Authorization: `Authorization ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status === 401 || response.status === 500) {
        window.location.href = "/sign-in";
        return;
      } else if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast({
        title: "Success",
        description: "Document deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const projects = [...new Set(documents.map((doc) => doc.project.name))];

  return (
    <div className="space-y-6 animate-fade-in px-4">
      <div className="flex flex-col gap-2 pb-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
          Documents
        </h1>
        <p className="text-muted-foreground">
          Access and manage AI-generated project documentation.
        </p>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TabsContent value="all" className="space-y-0 m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  deleteDocument={deleteDocument}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No documents found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We couldn't find any documents matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {projects.map((project) => (
          <TabsContent
            key={project}
            value={project.toLowerCase().replace(/\s+/g, "-")}
            className="m-0"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    deleteDocument={deleteDocument}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    No documents found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We couldn't find any documents matching your search
                    criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const DocumentCard = ({
  doc,
  deleteDocument,
}: {
  doc: Document;
  deleteDocument: (id: string) => void;
}) => {
  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return "default";
      case DocumentStatus.REVIEW:
        return "secondary";
      case DocumentStatus.REJECTED:
        return "destructive";
      case DocumentStatus.ARCHIVED:
        return "outline";
      case DocumentStatus.DRAFT:
      default:
        return "secondary";
    }
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const router = useRouter();

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-sm font-medium line-clamp-1">
                {doc.name}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-1">
                {doc.project.name}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={getStatusVariant(doc.status)}
            className="text-xs whitespace-nowrap"
          >
            {getStatusDisplay(doc.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2 text-sm">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
            {doc.project.projectType}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground border-t border-border/20 pt-3">
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>{doc.createdBy}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{formatISODate(doc.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-3 w-3" />
            <span>{doc.views} views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{formatISODate(doc.updatedAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-2 border-t border-border/20">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs font-normal"
          onClick={() => router.push(`/documents/${doc.id}`)}
        >
          <Eye className="h-3 w-3" />
          View
        </Button>
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => deleteDocument(doc.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

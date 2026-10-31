"use client";
import { ProjectCreationWizard } from "@/components/project-creation-wizard";
import { Toaster } from "@/components/ui/toast-provider";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function NewProjectPage() {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session.data) {
      router.push("/");
    }
  }, [session]);
  return (
    <div className="container mx-auto py-8 px-4">
      <ProjectCreationWizard />
    </div>
  );
}

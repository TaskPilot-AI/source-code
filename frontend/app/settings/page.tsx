"use client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";
import { useSession } from "@/lib/auth-client";
import { Suspense } from "react";

export default function SettingsPage() {
  const session = useSession();

  if (!session?.data) {
    redirect("/");
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
          <SettingsForm />
      </div>
    </div>
  );
}

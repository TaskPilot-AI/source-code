import { Suspense } from "react";
import { SettingsForm } from "../settings/settings-form";

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SettingsForm />
    </Suspense>
  );
}

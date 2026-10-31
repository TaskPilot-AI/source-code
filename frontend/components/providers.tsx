"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

function SessionSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      localStorage.setItem("adminId", user.id);
      localStorage.setItem("adminEmail", user.email);
      localStorage.setItem("adminName", user.name || "");
      if (session.session?.token) {
        localStorage.setItem("accessToken", session.session.token);
        localStorage.setItem("authToken", session.session.token);
      }
    }
  }, [session]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionSync />
      {children}
    </>
  );
}

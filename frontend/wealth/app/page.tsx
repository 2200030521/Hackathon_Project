"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/ui";

export default function HomePage() {
  const router = useRouter();
  const { user, investorId, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
    if (user?.role === "ADMIN") {
      router.replace("/dashboard");
    } else if (investorId) {
      router.replace(`/holdings/${investorId}`);
    } else {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, investorId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState />
    </div>
  );
}

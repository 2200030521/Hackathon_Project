"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Alert, Card, LoadingState } from "@/components/ui";

export default function RefreshTokenPage() {
  const { refreshToken } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const ok = await refreshToken();
      if (ok) {
        setMessage("Token refreshed successfully.");
        setTimeout(() => router.push("/"), 1500);
      } else {
        setMessage("Unable to refresh token. Please sign in again.");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    })();
  }, [refreshToken, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <Card className="w-full max-w-md text-center">
        {!message ? (
          <LoadingState />
        ) : (
          <Alert
            message={message}
            type={message.includes("success") ? "success" : "error"}
          />
        )}
      </Card>
    </div>
  );
}

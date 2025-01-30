"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ConnectEmailButton() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      // Connect email
      const response = await fetch("/api/emails/connect", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to connect");

      const { url } = await response.json();

      // Trigger sync immediately after connection
      await fetch("/api/emails/sync", {
        method: "POST",
      });

      window.location.href = url;
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Email"}
    </Button>
  );
}

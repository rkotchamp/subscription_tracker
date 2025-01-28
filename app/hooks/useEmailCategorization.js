"use client";

import { useState } from "react";

export function useEmailCategorization() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const categorizeEmails = async (emails) => {
    setIsProcessing(true);
    setError(null);

    try {
      const results = await Promise.all(
        emails.map(async (email) => {
          const response = await fetch("/api/emails/categorize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to categorize email: ${response.statusText}`
            );
          }

          return response.json();
        })
      );

      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    categorizeEmails,
    isProcessing,
    error,
  };
}

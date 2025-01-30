"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export function useEmailCategorization() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const categorizeEmails = async (emails, emailAccountId) => {
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
            body: JSON.stringify({
              email,
              userId: session?.user?.id,
              emailAccountTrackedFrom: emailAccountId,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to categorize email: ${response.statusText}`
            );
          }

          const result = await response.json();
          return result;
        })
      );

      // Group results by category
      const categorizedResults = results.reduce((acc, result) => {
        if (result.tracked && result.analysis.category) {
          const category = result.analysis.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            name: result.analysis.serviceName,
            date: result.email.date,
            statement: result.email.subject,
            email: result.email.sender,
            amount: result.analysis.amount || 0,
            billingFrequency: result.analysis.billingFrequency,
          });
        }
        return acc;
      }, {});

      return categorizedResults;
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

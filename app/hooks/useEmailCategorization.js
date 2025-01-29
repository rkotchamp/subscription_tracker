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

    console.log("Hook - Starting categorization for emails:", emails.length);

    try {
      const results = await Promise.all(
        emails.map(async (email) => {
          console.log("Hook - Processing email:", {
            subject: email.subject,
            from: email.from,
          });

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
          console.log("Hook - Categorization result:", result);
          return result;
        })
      );

      console.log("Hook - All results:", results);

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

      console.log("Hook - Categorized results:", categorizedResults);
      return categorizedResults;
    } catch (err) {
      console.error("Hook - Error:", err);
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

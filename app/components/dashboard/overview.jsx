"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionChart } from "@/components/ui/Chart/chart-pie-donut";
import { UntrackedSubscriptions } from "@/components/ui/untrackedTable/untracked-subscriptions";
import { UpcomingSubscriptions } from "@/components/ui/upcomingTable/upcoming-subscriptions";
import { CategoryDetails } from "@/components/dashboard/category-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Overview() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({
    categories: [],
    untracked: [],
    upcoming: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription data");
      }
      const { subscriptions, untracked, upcoming } = await response.json();

      // Filter out advertisements and null amounts
      const validSubscriptions = subscriptions.filter(
        (sub) =>
          sub.category !== "Advertisement" &&
          sub.amount !== null &&
          sub.amount !== undefined &&
          sub.status === "active" &&
          sub.emailAccountTrackedFrom
      );

      // Calculate total subscription amount
      const total = validSubscriptions.reduce(
        (sum, sub) => sum + (Number(sub.amount) || 0),
        0
      );

      // Group subscriptions by category
      const groupedByCategory = validSubscriptions.reduce(
        (acc, subscription) => {
          const category = subscription.category || "Unknown";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(subscription);
          return acc;
        },
        {}
      );

      // Transform the data for the chart
      const transformedData = {
        categories: Object.entries(groupedByCategory).map(
          ([category, items]) => ({
            name: category,
            value: items.reduce(
              (sum, item) => sum + (Number(item.amount) || 0),
              0
            ),
            items: items,
          })
        ),
        untracked: untracked || [],
        upcoming: upcoming || [],
        total,
      };

      console.log("Transformed data:", transformedData);
      setSubscriptionData(transformedData);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      setSubscriptionData({
        categories: [],
        untracked: [],
        upcoming: [],
        total: 0,
      });
    } finally {
      setIsLoading(false);
      setShouldRefresh(false);
    }
  };

  const syncEmails = async () => {
    try {
      setIsSyncing(true);

      const response = await fetch("/api/emails/sync", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sync emails");
      }

      const data = await response.json();

      toast({
        title: "Sync Complete",
        description: `Processed ${data.processedEmails} emails`,
      });

      // Optionally refresh the page or update state
      window.location.reload();
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const checkAndSync = async () => {
      try {
        const response = await fetch("/api/emails/connected");
        if (!response.ok) {
          throw new Error("Failed to check connected emails");
        }

        const { connectedEmails } = await response.json();

        if (connectedEmails?.length > 0 && !isSyncing) {
          await syncEmails();
        }
      } catch (error) {
        console.error("Error checking connected emails:", error);
      }
    };

    checkAndSync();
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      fetchSubscriptionData();
    }
  }, [shouldRefresh]);

  useEffect(() => {
    fetchSubscriptionData();
    return () => {
      setShouldRefresh(false);
    };
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleTotalClick = () => {
    router.push("/dashboard/subscriptions");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pr-4">
      <div className="grid gap-4 md:grid-cols-2 w-full">
        {selectedCategory ? (
          <div className="md:col-span-2 w-full">
            <CategoryDetails
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
            />
          </div>
        ) : (
          <>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <SubscriptionChart
                data={subscriptionData}
                onCategoryClick={handleCategoryClick}
                onTotalClick={handleTotalClick}
              />
            </div>
            <div className="grid gap-4">
              <UntrackedSubscriptions
                data={subscriptionData?.untracked || []}
              />
              <UpcomingSubscriptions data={subscriptionData?.upcoming || []} />
            </div>
          </>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={syncEmails}
              disabled={isSyncing}
              className="w-full"
            >
              {isSyncing ? "Syncing..." : "Sync Emails"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionChart } from "@/components/ui/Chart/chart-pie-donut";
import { UntrackedSubscriptions } from "@/components/ui/untrackedTable/untracked-subscriptions";
import { UpcomingSubscriptions } from "@/components/ui/upcomingTable/upcoming-subscriptions";
import { CategoryDetails } from "@/components/dashboard/category-details";

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

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription data");
      }
      const data = await response.json();

      // Filter out advertisements and null amounts
      const validSubscriptions = data.filter(
        (sub) =>
          sub.category !== "Advertisement" &&
          sub.amount !== null &&
          sub.amount !== undefined &&
          sub.status === "active" &&
          sub.emailAccountTrackedFrom // Ensure we have the email source
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
        untracked: data.filter((sub) => sub.status === "pending_review"),
        upcoming: data.filter((sub) => {
          if (!sub.renewalDate) return false;
          const renewalDate = new Date(sub.renewalDate);
          const today = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
        }),
        total,
      };

      setSubscriptionData(transformedData);
      console.log("Transformed data:", transformedData);
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
      </div>
    </div>
  );
}

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
  const [subscriptionData, setSubscriptionData] = useState(null);
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

      // Transform the data for the chart
      const transformedData = {
        categories: Object.keys(data).map((category) => ({
          name: category,
          value: data[category].reduce((sum, item) => sum + item.amount, 0),
        })),
        untracked: data.untracked || [],
        upcoming: data.upcoming || [],
      };

      setSubscriptionData(transformedData);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
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

  // Only set up periodic refresh if path changes or new data is needed
  useEffect(() => {
    const intervalId = setInterval(() => {
      setShouldRefresh(true);
    }, 30000); // Check for updates every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleTotalClick = () => {
    router.push("/dashboard/subscriptions");
  };

  if (isLoading && !subscriptionData) {
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
                key={JSON.stringify(subscriptionData)} // Force re-render when data changes
                data={subscriptionData}
                onCategoryClick={handleCategoryClick}
                onTotalClick={handleTotalClick}
              />
            </div>
            <div className="grid gap-4">
              <UntrackedSubscriptions data={subscriptionData?.untracked} />
              <UpcomingSubscriptions data={subscriptionData?.upcoming} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

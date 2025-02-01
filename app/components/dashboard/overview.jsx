"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CategoryDetails } from "@/components/dashboard/category-details";
import { UntrackedSubscriptions } from "@/components/ui/untrackedTable/untracked-subscriptions";
import { UpcomingSubscriptions } from "@/components/ui/upcomingTable/upcoming-subscriptions";
import { SubscriptionChart } from "@/components/ui/Chart/chart-pie-donut";

export function Overview() {
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data, setData] = useState({
    categories: [],
    untracked: [],
    upcoming: [],
    total: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch("/api/subscriptions");
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();

      // Categorize subscriptions
      const categorizedData = categorizeSubscriptions(result.subscriptions);
      setData(categorizedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const categorizeSubscriptions = (subscriptions) => {
    const categories = {
      "Software & SaaS": [],
      "Media & Content": [],
      "E-Commerce": [],
      "IT Infrastructure": [],
    };

    subscriptions.forEach((sub) => {
      if (categories[sub.category]) {
        categories[sub.category].push(sub);
      }
    });

    return {
      categories: Object.entries(categories).map(([name, items]) => ({
        name,
        items,
        value: items.reduce((sum, item) => sum + item.amount, 0), // Sum amounts for each category
      })),
      untracked: [], // Handle untracked subscriptions if needed
      upcoming: [], // Handle upcoming subscriptions if needed
      total: subscriptions.reduce((sum, sub) => sum + sub.amount, 0), // Total amount
    };
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

      const result = await response.json();
      toast({
        title: "Sync Complete",
        description: `Processed ${result.processedEmails} emails`,
      });

      await fetchSubscriptionData();
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleTotalClick = () => {
    setSelectedCategory({
      name: "All Categories",
      items: data.categories.flatMap((cat) => cat.items || []),
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      {selectedCategory ? (
        <CategoryDetails
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column - Charts */}
            <div className="space-y-4">
              {/* Total Subscriptions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Subscriptions</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Start tracking your subscriptions
                  </div>
                </CardHeader>
                <CardContent>
                  <SubscriptionChart
                    data={data}
                    onCategoryClick={handleCategoryClick}
                    onTotalClick={handleTotalClick}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tables */}
            <div className="space-y-4">
              <UntrackedSubscriptions />
              <UpcomingSubscriptions />
            </div>
          </div>

          {/* Sync Button Card at Bottom */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={syncEmails}
                disabled={isSyncing}
                className="w-full"
              >
                {isSyncing ? "Syncing..." : "Sync Emails"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

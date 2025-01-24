"use client";

import { useState } from "react";
import { SubscriptionChart } from "@/components/ui/Chart/chart-pie-donut";
import { UntrackedSubscriptions } from "@/components/ui/untrackedTable/untracked-subscriptions";
import { UpcomingSubscriptions } from "@/components/ui/upcomingTable/upcoming-subscriptions";
import { CategoryDetails } from "@/components/dashboard/category-details";

export function Overview() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {selectedCategory ? (
          <CategoryDetails
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
          />
        ) : (
          <>
            <SubscriptionChart onCategoryClick={setSelectedCategory} />
            <div className="grid gap-4">
              <UntrackedSubscriptions />
              <UpcomingSubscriptions />
            </div>
          </>
        )}
      </div>
      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}

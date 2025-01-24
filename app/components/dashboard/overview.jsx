"use client";

import { useState } from "react";
import { SubscriptionChart } from "@/components/ui/Chart/chart-pie-donut";
import { UntrackedSubscriptions } from "@/components/ui/untrackedTable/untracked-subscriptions";
import { UpcomingSubscriptions } from "@/components/ui/upcomingTable/upcoming-subscriptions";
import { CategoryDetails } from "@/components/dashboard/category-details";

export function Overview() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="flex flex-col space-y-4 min-h-full">
      <div className="grid gap-4 md:grid-cols-2 h-full">
        {selectedCategory ? (
          <div className="md:col-span-2">
            <CategoryDetails
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
            />
          </div>
        ) : (
          <>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <SubscriptionChart onCategoryClick={setSelectedCategory} />
            </div>
            <div className="grid gap-4">
              <UntrackedSubscriptions />
              <UpcomingSubscriptions />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

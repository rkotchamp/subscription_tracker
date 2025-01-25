"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionChart } from "@/components/ui/Chart/chart-pie-donut";
import { UntrackedSubscriptions } from "@/components/ui/untrackedTable/untracked-subscriptions";
import { UpcomingSubscriptions } from "@/components/ui/upcomingTable/upcoming-subscriptions";
import { CategoryDetails } from "@/components/dashboard/category-details";

export function Overview() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleTotalClick = () => {
    router.push('/dashboard/subscriptions');
  };

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
                onCategoryClick={handleCategoryClick}
                onTotalClick={handleTotalClick} 
              />
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

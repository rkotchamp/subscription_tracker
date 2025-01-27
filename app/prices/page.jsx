"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PricingCard } from "@/components/ui/pricing-card";
import { ArrowLeft } from "lucide-react";

const pricingPlans = {
  monthly: [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "0",
      interval: "month",
      features: [
        "Up to 5 email accounts",
        "Basic subscription tracking",
        "7-day history",
        "Email support",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      description: "Best for professionals",
      price: "9.99",
      interval: "month",
      features: [
        "Unlimited email accounts",
        "Advanced subscription detection",
        "Unlimited history",
        "Priority support",
        "Custom categories",
        "Export data",
        "Team collaboration",
      ],
      buttonText: "Upgrade to Pro",
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: "29.99",
      interval: "month",
      features: [
        "Everything in Pro",
        "Custom integration",
        "Dedicated support",
        "API access",
        "SSO authentication",
        "Advanced analytics",
        "Custom branding",
      ],
      buttonText: "Contact Sales",
    },
  ],
  yearly: [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "0",
      interval: "year",
      features: [
        "Up to 5 email accounts",
        "Basic subscription tracking",
        "7-day history",
        "Email support",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      description: "Best for professionals",
      price: "99.99",
      interval: "year",
      features: [
        "Unlimited email accounts",
        "Advanced subscription detection",
        "Unlimited history",
        "Priority support",
        "Custom categories",
        "Export data",
        "Team collaboration",
      ],
      buttonText: "Upgrade to Pro",
      savings: "Save $20",
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: "299.99",
      interval: "year",
      features: [
        "Everything in Pro",
        "Custom integration",
        "Dedicated support",
        "API access",
        "SSO authentication",
        "Advanced analytics",
        "Custom branding",
      ],
      buttonText: "Contact Sales",
      savings: "Save $60",
    },
  ],
};

export default function PricePage() {
  const router = useRouter();
  const [interval, setInterval] = useState("yearly");

  const handleUpgrade = (plan) => {
    if (plan.name === "Pro") {
      router.push("/dashboard/settings/billing");
    } else if (plan.name === "Enterprise") {
      // Handle enterprise contact
      console.log("Contact sales for enterprise plan");
    } else {
      router.push("/auth/signup");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto  flex justify-center items-center">
      <div className="container max-w-7xl px-4 py-6  w-full">
        {/* Back Navigation */}
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground mb-8">
            Choose the perfect plan for your subscription tracking needs. All
            plans include a 14-day free trial.
          </p>

          {/* Billing Interval Toggle */}
          <div className="relative inline-flex mx-auto">
            <div className="flex rounded-full bg-muted p-1 relative">
              <button
                onClick={() => setInterval("monthly")}
                className={`px-8 py-2 rounded-full text-sm font-medium transition-colors relative z-10
                  ${
                    interval === "monthly"
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval("yearly")}
                className={`px-8 py-2 rounded-full text-sm font-medium transition-colors relative z-10
                  ${
                    interval === "yearly"
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Yearly
              </button>
              {/* Sliding background */}
              <div
                className={`absolute inset-y-1 w-[50%] bg-primary rounded-full transition-transform duration-200 ease-in-out ${
                  interval === "yearly" ? "translate-x-full" : "translate-x-0"
                }`}
              />
            </div>
            {/* Save badge */}
            {interval === "yearly" && (
              <span className="absolute -top-7 right-3 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
          {pricingPlans[interval].map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isPopular={plan.name === "Pro"}
              onUpgrade={handleUpgrade}
            />
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            Have questions about our pricing?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push("/privacy?section=support")}
            >
              Contact our support team
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PricingCard } from "@/components/ui/pricing-card";

const pricingPlans = [
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
];

export default function PricePage() {
  const router = useRouter();

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground">
            Choose the perfect plan for your subscription tracking needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
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
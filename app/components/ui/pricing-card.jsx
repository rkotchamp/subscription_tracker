"use client";

import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PricingCard({ plan, isPopular, onUpgrade }) {
  return (
    <Card className="relative flex flex-col p-6">
      {isPopular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
          Most Popular
        </div>
      )}

      {/* Card Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-5">
          <h3 className="font-bold">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-5">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>

        {/* Features List - This will grow but maintain spacing */}
        <div className="flex-1 space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button - Will stay at bottom */}
        <div className="mt-6">
          <Button
            className="w-full"
            variant={isPopular ? "default" : "outline"}
            onClick={() => onUpgrade(plan)}
          >
            {plan.buttonText}
          </Button>
        </div>
      </div>
    </Card>
  );
}

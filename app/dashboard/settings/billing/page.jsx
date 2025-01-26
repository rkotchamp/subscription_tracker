"use client";

import { CreditCard, Check, Zap } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for current subscription
const subscriptionData = {
  plan: "Free",
  status: "active",
  nextBilling: "N/A",
  paymentMethod: {
    last4: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2024,
  },
  features: [
    "Up to 5 email accounts",
    "Basic subscription tracking",
    "7-day history",
    "Email support",
  ],
  proFeatures: [
    "Unlimited email accounts",
    "Advanced subscription detection",
    "Unlimited history",
    "Priority support",
    "Custom categories",
    "Export data",
    "Team collaboration",
  ],
};

export default function BillingPage() {
  return (
    <div className="flex flex-col w-full">
      <header className="flex h-16 shrink-0 items-center border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>Settings</BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Billing</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4 w-full">
        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {subscriptionData.plan}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Features included:</div>
                <ul className="grid gap-2 text-sm">
                  {subscriptionData.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscriptionData.paymentMethod ? (
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {subscriptionData.paymentMethod.brand.toUpperCase()} ****{" "}
                      {subscriptionData.paymentMethod.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {subscriptionData.paymentMethod.expiryMonth}/
                      {subscriptionData.paymentMethod.expiryYear}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Update
                  </Button>
                </div>
              ) : (
                <Button variant="outline">Add Payment Method</Button>
              )}
            </CardContent>
          </Card>

          {/* Upgrade Plan */}
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Upgrade to Pro</CardTitle>
              </div>
              <CardDescription>
                Get access to all premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Pro features include:</div>
                <ul className="grid gap-2 text-sm">
                  {subscriptionData.proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="text-2xl font-bold">$9.99</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                <Button size="lg" className="font-semibold">
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

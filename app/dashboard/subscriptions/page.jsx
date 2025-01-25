"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, DollarSign, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Updated mock data with dates
const allSubscriptions = [
  {
    name: "Adobe Creative Cloud",
    category: "Software & SaaS",
    email: "billing@adobe.com",
    amount: 599.88,
    date: "2024-02-15",
  },
  {
    name: "GitHub Team",
    category: "Software & SaaS",
    email: "billing@github.com",
    amount: 44.0,
    date: "2024-02-10",
  },
  {
    name: "Netflix Premium",
    category: "Media & Content",
    email: "info@netflix.com",
    amount: 19.99,
    date: "2024-02-05",
  },
  {
    name: "Spotify Family",
    category: "Media & Content",
    email: "billing@spotify.com",
    amount: 14.99,
    date: "2024-02-20",
  },
  {
    name: "AWS Cloud Services",
    category: "IT Infrastructure",
    email: "billing@aws.amazon.com",
    amount: 245.5,
    date: "2024-02-12",
  },
  // Add more subscriptions as needed
];

export default function SubscriptionsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [categoryFilter, setCategoryFilter] = useState(
    categoryFromUrl || "all"
  );
  const [emailFilter, setEmailFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // Update category filter when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Get unique categories and emails for filters
  const uniqueCategories = [
    ...new Set(allSubscriptions.map((sub) => sub.category)),
  ];
  const uniqueEmails = [...new Set(allSubscriptions.map((sub) => sub.email))];

  // Get today's date at the start of the day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter and sort subscriptions
  const filteredSubscriptions = allSubscriptions
    .filter((sub) => {
      const matchesCategory =
        categoryFilter === "all" || sub.category === categoryFilter;
      const matchesEmail = emailFilter === "all" || sub.email === emailFilter;

      // Date range filter
      const subDate = new Date(sub.date);
      const matchesDateRange =
        !dateRange.from ||
        !dateRange.to ||
        (subDate >= dateRange.from && subDate <= dateRange.to);

      return matchesCategory && matchesEmail && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      return 0;
    });

  const totalAmount = filteredSubscriptions.reduce(
    (sum, sub) => sum + sub.amount,
    0
  );

  // Add clear filters function
  const handleClearFilters = () => {
    setCategoryFilter("all");
    setEmailFilter("all");
    setSortBy("default");
    setDateRange({ from: null, to: null });
  };

  return (
    <div className="flex flex-col w-full">
      <header className="flex h-16 shrink-0 items-center border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Subscriptions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Subscriptions</CardTitle>
              <CardDescription>
                Total Monthly Expenses: ${totalAmount.toFixed(2)}
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              {/* Clear Filters Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                className="h-10 w-10"
                title="Clear all filters"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <Layers className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span>All categories</span>
                  </SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <span>{category}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Email Filter */}
              <Select value={emailFilter} onValueChange={setEmailFilter}>
                <SelectTrigger className="w-[200px]">
                  <Mail className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by email" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span>All emails</span>
                  </SelectItem>
                  {uniqueEmails.map((email) => (
                    <SelectItem key={email} value={email}>
                      <span>{email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort by Amount */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <span>Default</span>
                  </SelectItem>
                  <SelectItem value="amount">
                    <span>Most Expensive</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date > today}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {subscription.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {subscription.email}
                    </TableCell>
                    <TableCell className="text-right">
                      ${subscription.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { ArrowLeft, Calendar, Mail, DollarSign, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Mock data for category expenses
const getCategoryExpenses = (category) =>
  ({
    "Software & SaaS": [
      {
        name: "Adobe Creative Cloud",
        date: "2024-02-15",
        statement: "Annual Subscription Renewal",
        email: "billing@adobe.com",
        amount: 599.88,
      },
      {
        name: "GitHub Team",
        date: "2024-02-10",
        statement: "Monthly Team License",
        email: "billing@github.com",
        amount: 44.0,
      },
    ],
    "Media & Content": [
      {
        name: "Netflix Premium",
        date: "2024-02-01",
        statement: "Monthly Streaming Subscription",
        email: "info@netflix.com",
        amount: 19.99,
      },
      {
        name: "Spotify Family",
        date: "2024-02-05",
        statement: "Monthly Family Plan",
        email: "billing@spotify.com",
        amount: 14.99,
      },
    ],
    "E-Commerce": [
      {
        name: "Amazon Prime",
        date: "2024-02-20",
        statement: "Annual Membership Renewal",
        email: "billing@amazon.com",
        amount: 139.0,
      },
      {
        name: "Shopify Basic",
        date: "2024-02-15",
        statement: "Monthly Store Subscription",
        email: "billing@shopify.com",
        amount: 29.0,
      },
    ],
    "IT Infrastructure": [
      {
        name: "AWS Cloud Services",
        date: "2024-02-28",
        statement: "Monthly Cloud Computing Resources",
        email: "billing@aws.amazon.com",
        amount: 245.5,
      },
      {
        name: "Digital Ocean",
        date: "2024-02-25",
        statement: "Monthly Server Hosting",
        email: "billing@digitalocean.com",
        amount: 40.0,
      },
    ],
  }[category.name] || []);

export function CategoryDetails({ category, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [emailFilter, setEmailFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const expenses = getCategoryExpenses(category);

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter((expense) => {
      const matchesEmail =
        emailFilter === "all" || expense.email.includes(emailFilter);
      const expenseDate = new Date(expense.date);
      const matchesDateRange =
        !dateRange.from ||
        !dateRange.to ||
        (expenseDate >= dateRange.from && expenseDate <= dateRange.to);

      return matchesEmail && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const uniqueEmails = [...new Set(expenses.map((expense) => expense.email))];

  // Get today's date at the start of the day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Add clear filters function
  const handleClearFilters = () => {
    setEmailFilter("all");
    setSortBy("default");
    setDateRange({ from: null, to: null });
  };

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <div className="h-full bg-black-500">
      <Card className="h-full">
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                Total: ${totalExpenses.toFixed(2)}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
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
                <SelectItem value="date">
                  <span>Most Recent</span>
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
                  <Calendar className="mr-2 h-4 w-4" />
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
                <CalendarComponent
                  initialFocus
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={(date) => date > today} // Disable future dates
                  defaultMonth={today} // Set default month to current month
                />
              </PopoverContent>
            </Popover>

            {/* Clear Filters Button - Now positioned next to filters */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              className="h-10 w-10"
              title="Clear all filters"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statement</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{expense.name}</TableCell>
                  <TableCell>
                    {format(new Date(expense.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{expense.statement}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {expense.email}
                  </TableCell>
                  <TableCell className="text-right">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

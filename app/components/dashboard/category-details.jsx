"use client";

import {
  ArrowLeft,
  Calendar,
  Mail,
  DollarSign,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { format, subMonths, addMonths } from "date-fns";
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
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useEmailCategorization } from "@/hooks/useEmailCategorization";

export function CategoryDetails({ category, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [emailFilter, setEmailFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { categorizeEmails, isProcessing } = useEmailCategorization();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && category) {
      // Transform the items from the category prop
      const transformedExpenses = (category.items || []).map(
        (subscription) => ({
          name: subscription.subscriptionName || "Unknown Service",
          date: subscription.date,
          statement: subscription.statement || "-",
          email: subscription.emailAccountTrackedFrom || "-",
          amount: Number(subscription.amount) || 0,
          billingFrequency: subscription.billingFrequency || "unknown",
        })
      );

      setExpenses(transformedExpenses);
      setIsLoading(false);
    }
  }, [mounted, category]);

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
              {dateRange.from && dateRange.to && (
                <CardDescription>
                  Date Range: {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </CardDescription>
              )}
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
                    "w-[240px] justify-start text-left font-normal ",
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
              <PopoverContent
                className="w-auto p-0"
                align="start"
                sideOffset={5}
              >
                <div className="flex flex-col space-y-4 p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium leading-none">Date Range</h4>
                      <p className="text-sm text-muted-foreground">
                        Pick a start and end date
                      </p>
                    </div>
                  </div>
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date > today}
                    defaultMonth={currentMonth}
                    components={{
                      IconLeft: () => null,
                      IconRight: () => null,
                    }}
                  />
                </div>
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
          {isLoading || isProcessing ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredExpenses.length === 0 &&
            dateRange.from &&
            dateRange.to ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="font-medium mb-2">No Data Available</h3>
              <p>No transactions found for the selected date range:</p>
              <p className="text-sm">
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="font-medium">No Data Available</h3>
              <p>No transactions found with current filters</p>
            </div>
          ) : (
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
                    <TableCell className="font-medium">
                      {expense.name}
                    </TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

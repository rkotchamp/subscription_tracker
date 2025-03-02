"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center absolute right-0 top-0",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 disabled:pointer-events-none disabled:opacity-20"
        ),
        nav_button_previous: "mr-1",
        nav_button_next: "ml-1",
        table: "w-full border-collapse",
        head_row: "flex w-full justify-between",
        head_cell:
          "w-9 font-normal text-[0.8rem] text-muted-foreground text-center",
        row: "flex w-full justify-between mt-2",
        cell: "w-9 h-9 text-center p-0",
        day: "w-9 h-9 p-0 font-normal aria-selected:opacity-100",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-30",
        day_hidden: "invisible",
        day_range_start: "bg-primary text-primary-foreground rounded-l",
        day_range_end: "bg-primary text-primary-foreground rounded-r",
        day_range_middle: "bg-accent/20", // Light gray background for range
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4" {...props} />
        ),
      }}
      disabled={(date) => date > today}
      fromDate={new Date(2000, 0)}
      toMonth={today}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

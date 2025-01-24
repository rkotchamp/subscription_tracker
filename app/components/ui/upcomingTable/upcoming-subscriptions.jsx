"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "../table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

const upcomingSubscriptions = [
  {
    name: "Netflix",
    expectedDate: "Around Feb 15",
    estimatedCost: "~$15.99",
    rawCost: 15.99,
  },
  {
    name: "Spotify Premium",
    expectedDate: "Early Feb",
    estimatedCost: "~$9.99",
    rawCost: 9.99,
  },
  {
    name: "Adobe Creative Cloud",
    expectedDate: "Feb 20-22",
    estimatedCost: "~$52.99",
    rawCost: 52.99,
  },
  {
    name: "AWS Services",
    expectedDate: "End of Feb",
    estimatedCost: "$100-150",
    rawCost: 125.0, // Taking average of range
  },
];

const totalExpected = upcomingSubscriptions.reduce(
  (sum, sub) => sum + sub.rawCost,
  0
);

export function UpcomingSubscriptions() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Subscriptions</CardTitle>
            <CardDescription>
              Expected charges for the coming month
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] p-4">
                <p>
                  This table shows predicted subscription charges for the
                  upcoming month. Dates and amounts are estimates based on
                  previous billing patterns and may vary slightly.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date Mostly Charged</TableHead>
              <TableHead>Expected Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingSubscriptions.map((sub, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{sub.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {sub.expectedDate}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {sub.estimatedCost}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="text-left font-medium">
                Expected charges for the coming month
              </TableCell>
              <TableCell className="text-right font-medium">
                ~${totalExpected.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

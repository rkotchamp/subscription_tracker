"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, AlertCircle } from "lucide-react";
import { untrackedSubscriptions } from "@/lib/mock/mock-data";
import { format } from "date-fns";

export function UntrackedSubscriptions() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Untracked Subscriptions</CardTitle>
            <CardDescription>
              Potential subscriptions that need your attention
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] p-4">
                <p>
                  These are subscription-related emails that our system has
                  detected but hasn't been able to automatically track. They
                  might need manual verification or additional information.
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
              <TableHead>Subject</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {untrackedSubscriptions.map((sub, index) => (
              <TableRow key={index}>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.subject}</TableCell>
                <TableCell>
                  {format(new Date(sub.time), "dd/MM/yyyy, HH:mm")}
                </TableCell>
                <TableCell>{sub.email}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Track
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

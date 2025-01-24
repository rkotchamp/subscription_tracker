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
import { Plus } from "lucide-react";
import { untrackedSubscriptions } from "@/lib/mock/mock-data";

export function UntrackedSubscriptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Untracked Subscriptions</CardTitle>
        <CardDescription>
          Potential subscriptions that need your attention
        </CardDescription>
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
                <TableCell>{new Date(sub.time).toLocaleString()}</TableCell>
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

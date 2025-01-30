"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const response = await fetch("/api/subscriptions");
        if (!response.ok) throw new Error("Failed to fetch subscriptions");
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions =
    filter === "all"
      ? subscriptions
      : subscriptions.filter((sub) => sub.category === filter);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Subscriptions</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Software & SaaS">Software & SaaS</SelectItem>
              <SelectItem value="Media & Content">Media & Content</SelectItem>
              <SelectItem value="E-Commerce">E-Commerce</SelectItem>
              <SelectItem value="IT Infrastructure">
                IT Infrastructure
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Billing Frequency</TableHead>
                <TableHead>Email Source</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.subscriptionName}</TableCell>
                  <TableCell>{sub.category}</TableCell>
                  <TableCell>${sub.amount?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>{sub.billingFrequency}</TableCell>
                  <TableCell>{sub.emailAccountTrackedFrom}</TableCell>
                  <TableCell>
                    {new Date(sub.lastUpdated).toLocaleDateString()}
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

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { emailAccounts } from "@/lib/mock-data";

export function EmailIntegration() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Account Integration</CardTitle>
        <CardDescription>Manage your connected email accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emailAccounts.map((account) => (
            <div
              key={account.email}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{account.email}</p>
                <p className="text-sm text-muted-foreground">
                  {account.provider}
                </p>
              </div>
              <Button variant="outline">Disconnect</Button>
            </div>
          ))}
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Email Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

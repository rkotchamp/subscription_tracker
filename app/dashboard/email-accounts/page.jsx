"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, MailPlus } from "lucide-react";
import { format } from "date-fns";

export default function EmailAccountsPage() {
  const [showProviders, setShowProviders] = useState(false);
  const [emailAccounts, setEmailAccounts] = useState([
    {
      id: 1,
      email: "user@gmail.com",
      provider: "Gmail",
      status: "active",
      lastSynced: "2024-02-20T10:00:00",
    },
    // Add more mock data as needed
  ]);

  const providers = [
    {
      name: "Gmail",
      icon: Mail,
      description: "Connect your Gmail account",
    },
    {
      name: "Outlook",
      icon: MailPlus,
      description: "Connect your Outlook account",
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <header className="flex h-16 shrink-0 items-center border-b bg-background">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Email Accounts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Email Accounts</h1>
          <Button onClick={() => setShowProviders(true)}>Add New Email</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connected Email Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Synced</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.provider}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          account.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {account.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(account.lastSynced), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showProviders} onOpenChange={setShowProviders}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Email Provider</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {providers.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                className="flex items-center justify-start gap-2 h-14"
                onClick={() => {
                  // Handle provider selection
                  console.log(`Selected ${provider.name}`);
                  setShowProviders(false);
                }}
              >
                <provider.icon className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{provider.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {provider.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

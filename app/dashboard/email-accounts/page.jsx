"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useGoogleApi } from "@/hooks/useGoogleApi";
import { format } from "date-fns";
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

export default function EmailAccountsPage() {
  const { data: session, status } = useSession();
  const { initGmail, fetchAndParseEmails } = useGoogleApi();
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
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }
  }, [status]);

  useEffect(() => {
    const initializeGmailApi = async () => {
      if (status === "authenticated" && session) {
        try {
          setIsLoading(true);
          await initGmail();
          const parsedEmails = await fetchAndParseEmails();
          setSubscriptions(parsedEmails);
        } catch (err) {
          console.error("Error initializing Gmail API:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeGmailApi();
  }, [status, session]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

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
        {isLoading ? (
          <div>Loading email data...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Email Accounts</h1>
              <Button onClick={() => setShowProviders(true)}>
                Add New Email
              </Button>
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
                    {subscriptions.length > 0 ? (
                      subscriptions.map((subscription) => (
                        <TableRow key={subscription.messageId}>
                          <TableCell>{subscription.from}</TableCell>
                          <TableCell>Gmail</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                              Active
                            </span>
                          </TableCell>
                          <TableCell>
                            {format(new Date(subscription.date), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          No email accounts connected. Click "Add New Email" to
                          get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
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

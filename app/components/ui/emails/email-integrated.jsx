"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Mail, MoreVertical, Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function EmailIntegration() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showProviders, setShowProviders] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedEmails, setConnectedEmails] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchingEmails, setFetchingEmails] = useState({});
  const [emailMessages, setEmailMessages] = useState({});

  const fetchAndProcessEmails = async (emailAccount) => {
    if (!emailAccount || !emailAccount._id) {
      return;
    }

    try {
      setIsFetching(true);

      const response = await fetch(
        `/api/emails/fetch?emailId=${emailAccount._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch emails");
      }

      // Refresh the connected emails list
      await refreshConnectedEmails();
    } catch (error) {
      console.error("Error in fetchAndProcessEmails:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const refreshConnectedEmails = async () => {
    if (!session?.user?.id) {
      return;
    }

    try {
      const response = await fetch(
        `/api/connected-emails?userId=${session.user.id}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch connected emails: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Map the data to include isPrimary flag
      const emailsWithPrimary = data.map((email) => ({
        ...email,
        id: email._id,
        isPrimary: email.emailAddress === session.user.email,
      }));

      setConnectedEmails(emailsWithPrimary);
    } catch (error) {
      console.error("Error refreshing connected emails:", error);
    }
  };

  // Add a function to check database state
  const checkDatabaseState = async () => {
    if (!session?.user?.id) return;

    try {
      await fetch(
        `/api/connected-emails?userId=${session.user.id}&checkState=true`
      );
    } catch (error) {
      console.error("Error checking database state:", error);
    }
  };

  // Initial fetch when session is ready
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      checkDatabaseState(); // Check database state first
      refreshConnectedEmails();
    }
  }, [status, session]);

  // Handle successful connection callback
  useEffect(() => {
    const handleSuccessfulConnection = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccess = urlParams.get("success") === "true";

      if (isSuccess && session?.user?.id) {
        await refreshConnectedEmails();
      }
    };

    handleSuccessfulConnection();
  }, [session]);

  const handleGmailConnect = async () => {
    try {
      setIsConnecting(true);
      const callbackUrl = `${window.location.origin}/dashboard/email-accounts?success=true`;

      await signIn("google", {
        callbackUrl,
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        prompt: "consent",
      });
    } catch (error) {
      console.error("Error connecting Gmail:", error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (emailId) => {
    try {
      const response = await fetch(`/api/connected-emails/${emailId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "inactive" }),
      });

      if (!response.ok) throw new Error("Failed to disconnect email");

      setConnectedEmails(
        connectedEmails.map((email) =>
          email.id === emailId ? { ...email, status: "inactive" } : email
        )
      );
    } catch (error) {
      console.error("Error disconnecting email:", error);
    }
  };

  const handleReconnect = async (emailId) => {
    try {
      const response = await fetch(`/api/connected-emails/${emailId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "active" }),
      });

      if (!response.ok) throw new Error("Failed to reconnect email");

      setConnectedEmails(
        connectedEmails.map((email) =>
          email.id === emailId ? { ...email, status: "active" } : email
        )
      );
    } catch (error) {
      console.error("Error reconnecting email:", error);
    }
  };

  const handleDelete = async (emailId) => {
    const emailToDelete = connectedEmails.find((email) => email.id === emailId);

    // Prevent deletion of primary email
    if (emailToDelete?.isPrimary) {
      return;
    }

    try {
      const response = await fetch(`/api/connected-emails/${emailId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete email");

      await refreshConnectedEmails();
    } catch (error) {
      console.error("Error deleting email:", error);
    }
  };

  const handleFetchEmails = async (emailId) => {
    try {
      setFetchingEmails((prev) => ({ ...prev, [emailId]: true }));

      const response = await fetch(`/api/emails/fetch?emailId=${emailId}`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch emails");
      }

      // Store the emails in state
      setEmailMessages((prev) => ({
        ...prev,
        [emailId]: data.emails,
      }));

      // Refresh the email list to update lastSynced
      await refreshConnectedEmails();
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setFetchingEmails((prev) => ({ ...prev, [emailId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Accounts</h1>
        <Button onClick={() => setShowProviders(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Email
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Email Accounts</CardTitle>
          <CardDescription>
            Manage your connected email accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Email Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connectedEmails.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No email accounts connected. Click "Add New Email" to get
                    started.
                  </TableCell>
                </TableRow>
              ) : (
                connectedEmails.map((email) => (
                  <TableRow key={`${email.userId}_${email.emailAddress}`}>
                    <TableCell>{email.emailAddress}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          email.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {email.status || "inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(email.lastSynced)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {email.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => handleDisconnect(email.id)}
                            >
                              Disconnect
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleReconnect(email.id)}
                            >
                              Connect
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(email.id)}
                            disabled={email.isPrimary}
                            className={
                              email.isPrimary ? "text-muted-foreground" : ""
                            }
                          >
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleFetchEmails(email.id)}
                            disabled={fetchingEmails[email.id]}
                          >
                            {fetchingEmails[email.id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Fetching...
                              </>
                            ) : (
                              "Fetch Emails"
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showProviders} onOpenChange={setShowProviders}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Email Provider</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2 h-14"
              onClick={handleGmailConnect}
              disabled={isConnecting}
            >
              <Mail className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Gmail</span>
                <span className="text-sm text-muted-foreground">
                  Connect your Gmail account
                </span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {connectedEmails.map(
        (email) =>
          emailMessages[email.id] && (
            <Card key={`messages-${email.id}`} className="mt-4">
              <CardHeader>
                <CardTitle>Recent Emails for {email.emailAddress}</CardTitle>
                <CardDescription>
                  Emails fetched from the last 90 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Subject</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Snippet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailMessages[email.id]?.length > 0 ? (
                      emailMessages[email.id].map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="font-medium">
                            {message.subject}
                          </TableCell>
                          <TableCell>{message.from}</TableCell>
                          <TableCell>
                            {new Date(message.date).toLocaleString()}
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {message.snippet}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground"
                        >
                          No emails found in the last 90 days
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
      )}
    </div>
  );
}

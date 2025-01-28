"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Plus, Mail } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export function EmailIntegration() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showProviders, setShowProviders] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedEmails, setConnectedEmails] = useState([]);

  // Fetch connected emails
  useEffect(() => {
    const fetchConnectedEmails = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(
            `/api/connected-emails?userId=${session.user.id}`
          );
          const data = await response.json();
          setConnectedEmails(data);
        } catch (error) {
          console.error("Error fetching connected emails:", error);
        }
      }
    };

    fetchConnectedEmails();
  }, [session?.user?.id]);

  const handleGmailConnect = async () => {
    try {
      console.log("Starting Gmail connection...");
      setIsConnecting(true);

      // Use window.location.origin to get the base URL
      const callbackUrl = `${window.location.origin}/dashboard/email-accounts`;

      // Remove redirect: false to allow the popup
      await signIn("google", {
        callbackUrl,
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        prompt: "consent",
      });

      // The modal will close automatically when redirected
    } catch (error) {
      console.error("Error connecting Gmail:", error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (emailId) => {
    try {
      await fetch(`/api/connected-emails/${emailId}`, {
        method: "DELETE",
      });
      setConnectedEmails(
        connectedEmails.filter((email) => email.id !== emailId)
      );
    } catch (error) {
      console.error("Error disconnecting email:", error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email Account Integration</CardTitle>
          <CardDescription>
            Manage your connected email accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedEmails.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{account.emailAddress}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.isPrimary ? "Primary" : "Secondary"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleDisconnect(account.id)}
                >
                  Disconnect
                </Button>
              </div>
            ))}
            <Button className="w-full" onClick={() => setShowProviders(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Email Account
            </Button>
          </div>
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
    </>
  );
}

"use client";

import { useState } from "react";
import { Bell, Mail, Info, Check, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock notification data
const initialNotifications = [
  {
    id: 1,
    title: "New Feature Available",
    message: "Try our new AI-powered subscription detection feature!",
    type: "announcement",
    timestamp: "2024-03-10T10:00:00",
    read: false,
    icon: Info,
  },
  {
    id: 2,
    title: "Subscription Renewal",
    message: "Your Netflix subscription will renew in 3 days",
    type: "subscription",
    timestamp: "2024-03-09T15:30:00",
    read: false,
    icon: Bell,
  },
  {
    id: 3,
    title: "Email Connected",
    message: "Successfully connected your Gmail account",
    type: "email",
    timestamp: "2024-03-08T09:15:00",
    read: true,
    icon: Mail,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    subscriptionAlerts: true,
    announcements: true,
  });

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col w-full ">
      <header className="flex h-16 shrink-0 items-center border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>Settings</BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>Notifications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4 w-full">
        <div className="space-y-6">
          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Your notification history and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Your notifications will appear here when you receive them
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`relative flex items-start space-x-4 rounded-lg border p-4 transition-colors ${
                          notification.read
                            ? "bg-background"
                            : "bg-muted/50 border-primary/20"
                        }`}
                      >
                        <div
                          className={`mt-1 ${
                            !notification.read && "text-primary"
                          }`}
                        >
                          <notification.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-medium leading-none ${
                                !notification.read && "text-primary"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <Badge variant="default" className="h-5">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-4 top-4"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications about your email connections
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Subscription Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about subscription renewals and changes
                  </div>
                </div>
                <Switch
                  checked={settings.subscriptionAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, subscriptionAlerts: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Announcements</div>
                  <div className="text-sm text-muted-foreground">
                    Receive updates about new features and improvements
                  </div>
                </div>
                <Switch
                  checked={settings.announcements}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, announcements: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

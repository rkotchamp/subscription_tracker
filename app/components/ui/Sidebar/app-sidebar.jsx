"use client";

import * as React from "react";
import {
  Bell,
  CreditCard,
  FileText,
  Home,
  Mail,
  Settings,
  Upload,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/ui/Sidebar/UIs/nav-main";
import { QuickAccess } from "@/components/ui/Sidebar/UIs/quick-access";
import { NavUser } from "@/components/ui/Sidebar/UIs/nav-user";
import { TeamSwitcher } from "@/components/ui/Sidebar/UIs/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Updated data structure for subscription tracker
const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  emailAccounts: [
    {
      name: "Personal Gmail",
      logo: Mail,
      type: "Gmail",
    },
    {
      name: "Work Outlook",
      logo: Mail,
      type: "Outlook",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Subscriptions",
          url: "/dashboard/subscriptions",
        },
        {
          title: "Invoices",
          url: "/dashboard/invoices",
        },
      ],
    },
    {
      title: "Email Accounts",
      url: "/email-accounts",
      icon: Mail,
      items: [
        {
          title: "Connected Accounts",
          url: "/email-accounts",
        },
        {
          title: "Add Account",
          url: "/email-accounts/add",
        },
      ],
    },
    {
      title: "Manual Upload",
      url: "/upload",
      icon: Upload,
      items: [
        {
          title: "Upload Invoice",
          url: "/upload/invoice",
        },
        {
          title: "Upload History",
          url: "/upload/history",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
      ],
    },
  ],
  quickAccess: [
    {
      name: "Recent Invoices",
      url: "/dashboard/invoices",
      icon: FileText,
    },
    {
      name: "Pending Uploads",
      url: "/upload",
      icon: Upload,
    },
    {
      name: "Notifications",
      url: "/notifications",
      icon: Bell,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher emailAccounts={data.emailAccounts} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <QuickAccess items={data.quickAccess} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

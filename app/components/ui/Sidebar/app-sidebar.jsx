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
  LayoutDashboard,
  Crown,
  HelpCircle,
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
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          isActive: true,
        },
        {
          title: "Subscriptions",
          url: "/dashboard/subscriptions",
        },
        // {
        //   title: "Invoices",
        //   url: "/dashboard/invoices",
        // },
      ],
    },
    {
      title: "Email Accounts",
      url: "/dashboard/email-accounts",
      icon: Mail,
      items: [
        {
          title: "Connected Accounts",
          url: "/dashboard/email-accounts",
        },
        // {
        //   title: "Add Account",
        //   url: "/dashboard/email-accounts/add",
        // },
      ],
    },
    {
      title: "Manual Upload",
      url: "/dashboard/upload",
      icon: Upload,
      items: [
        {
          title: "Upload Invoice",
          url: "/dashboard/upload",
        },
        // {
        //   title: "Upload History",
        //   url: "/upload/history",
        // },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard",
      icon: Settings,
      items: [
        {
          title: "Account",
          url: "/dashboard/settings/account",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
      ],
    },
  ],
  quickAccess: [
    {
      name: "Upgrade to Pro",
      url: "/prices",
      icon: Crown,
      internal: true,
    },
    {
      name: "What's New",
      url: "/dashboard/settings/notifications",
      icon: Bell,
      internal: true,
    },
    {
      name: "Privacy Policy",
      url: "/privacy?section=privacy",
      icon: FileText,
      internal: true,
    },
    {
      name: "Help & Support",
      url: "/privacy?section=support",
      icon: HelpCircle,
      internal: true,
    },
  ],
};

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manual Upload",
    href: "/upload",
    icon: Upload,
  },
  // ... other navigation items ...
];

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

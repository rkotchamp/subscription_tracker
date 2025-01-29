"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { EmailIntegration } from "@/components/ui/emails/email-integrated";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function EmailAccountsPage() {
  const { status } = useSession();

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

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
      <EmailIntegration />
    </div>
  );
}

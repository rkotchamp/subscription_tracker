"use client";

import { useState, useEffect } from "react";
import { FileText, HelpCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const navigation = [
  {
    title: "Privacy Policy",
    icon: FileText,
    id: "privacy",
  },
  {
    title: "Help & Support",
    icon: HelpCircle,
    id: "support",
  },
];

const content = {
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "March 15, 2024",
    content: [
      {
        title: "Introduction",
        text: "Welcome to our Privacy Policy. This document explains how we collect, use, and protect your personal information.",
      },
      {
        title: "Information We Collect",
        text: "We collect information that you provide directly to us, including email addresses and subscription data.",
      },
      // Add more privacy policy sections as needed
    ],
  },
  support: {
    title: "Help & Support",
    content: [
      {
        question: "How do I connect my email?",
        answer:
          "You can connect your email account by going to Email Accounts section and following the authentication process.",
      },
      {
        question: "How do I track my subscriptions?",
        answer:
          "Once your email is connected, we automatically detect and track your subscriptions. You can view them in the Dashboard.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes, we use industry-standard encryption and security measures to protect your data.",
      },
      // Add more FAQ items as needed
    ],
  },
};

export function PrivacyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("privacy");

  useEffect(() => {
    const section = searchParams.get("section");
    if (section && (section === "privacy" || section === "support")) {
      setActiveSection(section);
    } else {
      router.push("/privacy?section=privacy", { scroll: false });
    }
  }, [searchParams, router]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    router.push(`/privacy?section=${sectionId}`, { scroll: false });
  };

  return (
    <div className="flex flex-col w-full ">
      <header className="flex h-16 shrink-0 items-center border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{content[activeSection].title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-64 border-r bg-muted/10">
          <div className="flex flex-col gap-2 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "primary" : "ghost"}
                  className={`justify-start [&:not(:active)]:hover:bg-muted ${
                    activeSection === item.id
                      ? "[&]:bg-primary [&]:text-primary-foreground [&:hover]:bg-primary/90"
                      : ""
                  }`}
                  onClick={() => handleSectionChange(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-6 space-y-8">
              {activeSection === "privacy" ? (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Last updated: {content.privacy.lastUpdated}
                    </p>
                    {content.privacy.content.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h2 className="text-lg font-semibold">
                          {section.title}
                        </h2>
                        <p className="text-muted-foreground">{section.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {content.support.content.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

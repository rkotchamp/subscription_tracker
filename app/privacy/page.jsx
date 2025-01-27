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
        section: "Introduction",
        text: "At SubTracker, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.",
      },
      {
        section: "Information We Collect",
        text: "We collect information that you provide directly to us, including your name, email address, and subscription data from connected email accounts.",
      },
      {
        section: "How We Use Your Information",
        text: "We use your information to provide and improve our subscription tracking services, detect and analyze your subscriptions, and send you important notifications.",
      },
      {
        section: "Data Security",
        text: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.",
      },
    ],
  },
  support: {
    title: "Help & Support",
    content: [
      {
        section: "Getting Started",
        text: "Learn how to set up your account and connect your first email account.",
      },
      {
        section: "FAQ",
        items: [
          {
            question: "How do I connect my email account?",
            answer:
              "You can connect your email account by going to Email Accounts in the dashboard and clicking 'Connect Account'. We support Gmail, Outlook, and other major email providers.",
          },
          {
            question: "Is my data secure?",
            answer:
              "Yes, we use industry-standard encryption and security measures to protect your data. We never store your email passwords and use OAuth for authentication.",
          },
          {
            question: "How do I cancel my subscription?",
            answer:
              "You can cancel your subscription anytime by going to Settings > Billing and clicking 'Cancel Subscription'. Your data will be retained for 30 days after cancellation.",
          },
          {
            question: "Can I export my subscription data?",
            answer:
              "Yes, you can export your subscription data in CSV format from the dashboard. Go to Subscriptions and click the 'Export' button.",
          },
          {
            question: "What email providers do you support?",
            answer:
              "We currently support Gmail, Outlook, Yahoo Mail, and any email provider that supports IMAP. More providers are being added regularly.",
          },
        ],
      },
      {
        section: "Contact Support",
        text: "Need help? Our support team is available 24/7 to assist you.",
      },
    ],
  },
};

export default function PrivacyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("privacy");

  // Handle initial route and section highlighting
  useEffect(() => {
    const section = searchParams.get("section");
    if (section && (section === "privacy" || section === "support")) {
      setActiveSection(section);
    } else {
      // Default to privacy if no valid section is specified
      router.push("/privacy?section=privacy", { scroll: false });
    }
  }, [searchParams, router]);

  // Handle section changes
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    router.push(`/privacy?section=${sectionId}`, { scroll: false });
  };

  return (
    <div className="flex flex-col w-full ">
      <header className="flex h-16 shrink-0 items-center border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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

      <div className="flex h-[calc(100vh-4rem)] ">
        {/* Sidebar Navigation */}
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

        {/* Content Area */}
        <div className="flex-1 ">
          <ScrollArea className="h-full ">
            <div className="max-w-6xl mx-auto p-6 space-y-8  w-full">
              <div>
                <h1 className="text-2xl font-bold">
                  {content[activeSection].title}
                </h1>
                {activeSection === "privacy" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {content[activeSection].lastUpdated}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                {content[activeSection].content.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h2 className="text-lg font-semibold">{item.section}</h2>
                    {item.text && (
                      <p className="text-muted-foreground leading-relaxed">
                        {item.text}
                      </p>
                    )}
                    {item.items && (
                      <Accordion type="single" collapsible className="w-full">
                        {item.items.map((faq, faqIndex) => (
                          <AccordionItem
                            key={faqIndex}
                            value={`item-${faqIndex}`}
                          >
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                    {activeSection === "support" &&
                      item.section === "Contact Support" && (
                        <div className="mt-4">
                          <Button>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Contact Support
                          </Button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

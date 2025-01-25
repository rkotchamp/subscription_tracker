"use client";

import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/Sidebar/app-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { untrackedSubscriptions } from "@/lib/mock/mock-data";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    // Handle the files here
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    // Handle the files here
  };

  return (
    <div className="flex flex-col w-full">
      <header className="flex h-16 shrink-0 items-center border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Manual Upload</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-4">
        <div className="flex flex-col space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Invoices</CardTitle>
              <CardDescription>
                Drag and drop your invoice files or click to upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  multiple
                  onChange={handleChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, JPEG, or PNG
                  </p>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Untracked Subscriptions Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Untracked Subscriptions</CardTitle>
                  <CardDescription>
                    Review and track your subscription invoices
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] p-4">
                      <p>
                        Here's a list of emails we found that look like they
                        might be subscriptions. Take a look and let us know
                        which ones you want to track!
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {untrackedSubscriptions.map((sub, index) => (
                    <TableRow key={index}>
                      <TableCell>{sub.name}</TableCell>
                      <TableCell>{sub.subject}</TableCell>
                      <TableCell>
                        {format(new Date(sub.time), "dd/MM/yyyy, HH:mm")}
                      </TableCell>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Plus className="mr-2 h-4 w-4" /> Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { AppSidebar } from "@/components/ui/Sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden  w-full ">
        <AppSidebar />
        <main className="flex-1 overflow-auto h-full ">{children}</main>
      </div>
    </SidebarProvider>
  );
}

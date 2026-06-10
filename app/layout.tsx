import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "gluvok Dashboard | Platform Operations",
  description: "Access the gluvok platform tools, manage entities, configure visibility settings, and track operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", geist.className)}>
      <body className="min-h-full flex flex-col antialiased">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <TooltipProvider>{children}</TooltipProvider>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

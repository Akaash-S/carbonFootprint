import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Link, useLocation } from "wouter";
import { ChevronDown, Globe2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading, logoutMutation } = useAuth();
  const [location] = useLocation();
  
  // Don't display layout on the auth page
  const isAuthPage = location === "/auth";
  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="bg-neutral-100 text-neutral-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Globe2 className="w-8 h-8" />
              <h1 className="font-heading font-semibold text-xl">CarbonTrack</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {!isLoading && user && (
                <>
                  <span className="bg-accent text-neutral-900 font-medium text-sm py-1 px-3 rounded-full">
                    {user.points || 0} points
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-1">
                      <span>{user.firstName}</span>
                      <ChevronDown className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                      >
                        {logoutMutation.isPending ? "Signing out..." : (
                          <div className="flex items-center">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                          </div>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
            
            <button className="md:hidden">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 pb-16 md:pb-0 md:pl-64">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
}

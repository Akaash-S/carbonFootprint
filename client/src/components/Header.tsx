import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Globe2, Menu } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Track Activity", href: "/manual-entry" },
    { name: "Insights", href: "/insights" },
    { name: "Challenges", href: "/challenges" },
    { name: "Community", href: "/community" },
  ];

  return (
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
                  {user.points} points
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1">
                    <span>{user.firstName}</span>
                    <ChevronDown className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/logout">Log out</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 pt-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className="font-medium text-lg">{item.name}</a>
                  </Link>
                ))}
                <div className="border-t pt-4 mt-2">
                  <Link href="/profile">
                    <a className="font-medium text-lg">Profile</a>
                  </Link>
                  <Link href="/settings">
                    <a className="block font-medium text-lg mt-4">Settings</a>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

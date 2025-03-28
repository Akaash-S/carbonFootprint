import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, BarChart2, Shield, User, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNavigation() {
  const [location] = useLocation();
  const [actionSheetOpen, setActionSheetOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="w-6 h-6" />,
    },
    {
      name: "Insights",
      href: "/insights",
      icon: <BarChart2 className="w-6 h-6" />,
    },
    {
      name: "Challenges",
      href: "/challenges",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="w-6 h-6" />,
    },
  ];

  const actionItems = [
    {
      name: "Scan Barcode",
      href: "/scanner",
    },
    {
      name: "Manual Entry",
      href: "/manual-entry",
    },
    {
      name: "Voice Input",
      href: "/voice-input",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-neutral-200 z-40">
      <div className="flex justify-between items-center px-6 py-2">
        {navItems.map((item, index) => {
          // Center button is the action button
          if (index === 2) {
            return (
              <div className="relative -mt-5" key="action-button">
                <Sheet open={actionSheetOpen} onOpenChange={setActionSheetOpen}>
                  <SheetTrigger asChild>
                    <button className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                      <Plus className="w-8 h-8" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-xl">
                    <div className="py-4">
                      <h3 className="text-lg font-medium text-center mb-4">Track Activity</h3>
                      <div className="space-y-2">
                        {actionItems.map((action) => (
                          <Link key={action.href} href={action.href}>
                            <a
                              className="block w-full py-3 px-4 text-center bg-neutral-100 rounded-lg hover:bg-neutral-200"
                              onClick={() => setActionSheetOpen(false)}
                            >
                              {action.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            );
          }

          // Regular navigation items
          return (
            <Link key={item.href} href={item.href}>
              <a className={`flex flex-col items-center py-1 ${location === item.href ? 'text-primary' : 'text-neutral-500'}`}>
                {item.icon}
                <span className="text-xs">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

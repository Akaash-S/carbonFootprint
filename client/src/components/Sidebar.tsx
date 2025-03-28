import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { useQuery } from "@tanstack/react-query";

import {
  Home,
  ClipboardList,
  BarChart2,
  Shield,
  Users,
  ShoppingCart,
  Settings,
  CheckCircle,
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <Home className="w-5 h-5 mr-3" />,
    },
    {
      name: "Track Activity",
      href: "/manual-entry",
      icon: <ClipboardList className="w-5 h-5 mr-3" />,
    },
    {
      name: "Insights",
      href: "/insights",
      icon: <BarChart2 className="w-5 h-5 mr-3" />,
    },
    {
      name: "Challenges",
      href: "/challenges",
      icon: <Shield className="w-5 h-5 mr-3" />,
    },
    {
      name: "Community",
      href: "/community",
      icon: <Users className="w-5 h-5 mr-3" />,
    },
    {
      name: "Offset Marketplace",
      href: "/marketplace",
      icon: <ShoppingCart className="w-5 h-5 mr-3" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5 mr-3" />,
    },
  ];

  return (
    <nav className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white shadow-md z-40 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6 p-3 bg-neutral-100 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-heading font-semibold text-sm">Your Impact</h3>
            <span className="text-xs text-neutral-500">This Week</span>
          </div>
          <div className="flex items-center justify-center relative pt-2">
            <ProgressCircle 
              value={76} 
              size="md" 
              labelText={<>
                <span className="font-mono text-lg font-bold">-76%</span>
                <span className="text-xs text-neutral-600">vs. avg</span>
              </>}
            />
          </div>
        </div>
        
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a
                  className={cn(
                    "flex items-center p-3 rounded-lg",
                    location === item.href
                      ? "text-primary bg-primary-light bg-opacity-10 font-medium"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  {item.icon}
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        
        {user && (
          <div className="mt-8 p-4 bg-secondary bg-opacity-10 rounded-lg">
            <h4 className="font-heading font-semibold text-secondary text-sm mb-2">
              Your Eco Status
            </h4>
            <div className="flex items-center space-x-3">
              <div className="bg-success text-white p-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-neutral-800">{user.ecoRank}</p>
                <p className="text-xs text-neutral-600">Top 15% in your region</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

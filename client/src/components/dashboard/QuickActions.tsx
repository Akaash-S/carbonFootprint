import React from "react";
import { Link } from "wouter";
import { Scan, Plus, Mic, BarChart2 } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Link href="/scanner">
        <a className="bg-primary text-white p-4 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
          <Scan className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Scan Barcode</span>
        </a>
      </Link>
      
      <Link href="/manual-entry">
        <a className="bg-white text-neutral-800 p-4 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
          <Plus className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Manual Entry</span>
        </a>
      </Link>
      
      <Link href="/voice-input">
        <a className="bg-white text-neutral-800 p-4 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
          <Mic className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Voice Input</span>
        </a>
      </Link>
      
      <Link href="/insights">
        <a className="bg-white text-neutral-800 p-4 rounded-xl flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
          <BarChart2 className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">View Insights</span>
        </a>
      </Link>
    </div>
  );
}

import React from "react";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { RecentScans } from "@/components/scanner/RecentScans";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ScannerPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" className="mr-3 p-0 h-auto">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h2 className="font-heading text-2xl font-semibold">Scan Product Barcode</h2>
      </div>
      
      <BarcodeScanner />
      <RecentScans />
    </div>
  );
}

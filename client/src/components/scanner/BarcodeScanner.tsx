import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScanner } from "@/hooks/use-scanner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function BarcodeScanner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [barcodeToLookup, setBarcodeToLookup] = useState<string | null>(null);
  
  const {
    barcode,
    scanning,
    error,
    startScanner,
    stopScanner,
    resetScanner
  } = useScanner("scanner-container");
  
  // Product data based on scanned barcode
  const { data: product, isError, isLoading } = useQuery({
    queryKey: [`/api/products/barcode/${barcodeToLookup}`],
    enabled: !!barcodeToLookup,
  });
  
  useEffect(() => {
    if (barcode) {
      // Set the scanned barcode for lookup
      setBarcodeToLookup(barcode);
    }
  }, [barcode]);
  
  const handleScanAgain = () => {
    setBarcodeToLookup(null);
    resetScanner();
    startScanner();
  };
  
  const handleProductNotFound = async () => {
    // Navigate to the add product form
    // In a real app, you would show a form to add the missing product
    toast({
      title: "Product Not Found",
      description: "This feature would allow users to add missing products to the database.",
      variant: "default",
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-5">
        {!barcode ? (
          <>
            <p className="text-center text-neutral-600 mb-4">
              Position the barcode within the frame to scan
            </p>
            <div
              id="scanner-container"
              className="aspect-video bg-neutral-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
            >
              {!scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p>Camera not active</p>
                  <Button 
                    onClick={startScanner} 
                    className="mt-4"
                  >
                    Start Scanner
                  </Button>
                </div>
              )}
              
              {scanning && (
                <>
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-amber-400 animate-[scan_2s_infinite]"></div>
                  <div className="border-2 border-amber-400 w-4/5 h-1/3 rounded-lg"></div>
                </>
              )}
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
                <p className="text-sm">Error: {error}</p>
                <p className="text-xs mt-1">
                  Make sure you have granted camera permissions and that your device has a camera.
                </p>
              </div>
            )}
            
            <p className="text-center text-sm text-neutral-500">
              For best results, ensure good lighting and hold the device steady
            </p>
            
            {scanning && (
              <Button 
                onClick={stopScanner} 
                variant="outline" 
                className="mt-4 w-full"
              >
                Cancel Scanning
              </Button>
            )}
          </>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-2">Barcode Scanned!</h3>
              <p className="text-neutral-600">Barcode: {barcode}</p>
            </div>
            
            {isLoading && (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Looking up product information...</p>
              </div>
            )}
            
            {isError && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-amber-800 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Product Not Found
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  This product is not in our database yet. Would you like to add it?
                </p>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" onClick={handleScanAgain}>
                    Scan Again
                  </Button>
                  <Button onClick={handleProductNotFound}>
                    Add Product Info
                  </Button>
                </div>
              </div>
            )}
            
            {product && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800">Product Found!</h4>
                <div className="mt-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm">
                    Carbon Footprint: {product.co2PerUnit} kg CO₂ per {product.unit}
                  </p>
                  {product.category && (
                    <p className="text-xs text-green-700 mt-1">Category: {product.category}</p>
                  )}
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={handleScanAgain}
                >
                  Scan Another Product
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

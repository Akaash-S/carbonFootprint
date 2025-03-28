import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export function RecentScans() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products/recent"],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-5">
          <h3 className="font-heading font-semibold mb-4">Recently Scanned</h3>
          
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg mr-3"></div>
                  <div>
                    <div className="h-5 bg-neutral-200 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-neutral-200 rounded w-40 mb-1"></div>
                    <div className="h-3 bg-neutral-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products?.map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-2xl text-neutral-400">🛒</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-neutral-600">
                      {product.co2PerUnit} kg CO₂ per {product.unit}
                    </p>
                    {product.category && (
                      <p className="text-xs text-success">
                        {product.category}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {(!products || products.length === 0) && (
                <p className="text-center py-4 text-neutral-500">
                  No recently scanned products
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-5">
          <h3 className="font-heading font-semibold mb-4">Missing Product?</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Help our community by adding missing product information to our database.
          </p>
          <Button className="w-full">
            Add Product Information
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

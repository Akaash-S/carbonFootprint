import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { insertActivitySchema } from "@shared/schema";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { calculateEmissions } from "@/lib/carbon-calculator";

// Enhanced schema for form validation
const formSchema = z.object({
  type: z.string().min(1, "Activity type is required"),
  subtype: z.string().min(1, "Please select a specific activity"),
  quantity: z.coerce.number().positive("Must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  date: z.string().min(1, "Date is required"),
  passengers: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ManualEntryForm({ onPreview }: { onPreview: (data: any) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [activityType, setActivityType] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      subtype: "",
      quantity: 0,
      unit: "",
      date: new Date().toISOString().slice(0, 16),
      passengers: 1,
      notes: "",
    },
  });
  
  const activityOptions = {
    transport: {
      subtypes: [
        { value: "car", label: "Car" },
        { value: "bus", label: "Bus" },
        { value: "train", label: "Train" },
        { value: "plane", label: "Airplane" },
        { value: "bicycle", label: "Bicycle" },
        { value: "walking", label: "Walking" },
      ],
      unit: "km",
      showPassengers: true,
    },
    food: {
      subtypes: [
        { value: "beef", label: "Beef" },
        { value: "pork", label: "Pork" },
        { value: "chicken", label: "Chicken" },
        { value: "fish", label: "Fish" },
        { value: "dairy", label: "Dairy" },
        { value: "vegetables", label: "Vegetables" },
        { value: "fruits", label: "Fruits" },
        { value: "grains", label: "Grains" },
      ],
      unit: "kg",
      showPassengers: false,
    },
    home: {
      subtypes: [
        { value: "electricity", label: "Electricity" },
        { value: "naturalGas", label: "Natural Gas" },
        { value: "heating", label: "Heating" },
        { value: "water", label: "Water" },
      ],
      unit: "kWh",
      showPassengers: false,
    },
    shopping: {
      subtypes: [
        { value: "clothing", label: "Clothing" },
        { value: "electronics", label: "Electronics" },
        { value: "furniture", label: "Furniture" },
        { value: "groceries", label: "Grocery Trip" },
      ],
      unit: "items",
      showPassengers: false,
    },
    waste: {
      subtypes: [
        { value: "landfill", label: "Landfill Waste" },
        { value: "recycled", label: "Recycled Waste" },
        { value: "composted", label: "Composted Waste" },
      ],
      unit: "kg",
      showPassengers: false,
    },
  };
  
  // When type changes, update subtypes and unit
  useEffect(() => {
    const type = form.watch("type");
    if (type && type !== activityType) {
      setActivityType(type);
      form.setValue("subtype", "");
      form.setValue("unit", activityOptions[type as keyof typeof activityOptions]?.unit || "");
    }
  }, [form.watch("type"), activityType, form]);
  
  // Calculate emissions whenever relevant fields change
  useEffect(() => {
    const formData = form.watch();
    if (formData.type && formData.subtype && formData.quantity) {
      const emissions = calculateEmissions(
        formData.type,
        formData.subtype,
        formData.quantity,
        formData.passengers
      );
      
      // Send to preview component
      const previewData = {
        description: getActivityDescription(formData),
        date: formatDate(formData.date),
        emissions,
      };
      
      onPreview(previewData);
    }
  }, [form.watch(), onPreview]);
  
  // Format activity description for preview
  const getActivityDescription = (data: FormValues) => {
    const subtypeLabel = activityOptions[data.type as keyof typeof activityOptions]?.subtypes.find(
      s => s.value === data.subtype
    )?.label;
    
    if (data.type === "transport") {
      return `${subtypeLabel} Trip (${data.quantity} ${data.unit}${data.passengers && data.passengers > 1 ? `, ${data.passengers} passengers` : ""})`;
    } else {
      return `${subtypeLabel} (${data.quantity} ${data.unit})`;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', day: 'numeric', year: 'numeric' 
      }) + `, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
  };
  
  // Submit the activity to the API
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Calculate emissions before submitting
      const emissions = calculateEmissions(
        data.type,
        data.subtype,
        data.quantity,
        data.passengers
      );
      
      // Prepare activity data for API
      const activityData = {
        type: data.type,
        subtype: data.subtype,
        description: getActivityDescription(data),
        quantity: data.quantity,
        unit: data.unit,
        co2Emissions: emissions,
        date: new Date(data.date).toISOString(),
        notes: data.notes,
        passengers: data.passengers,
      };
      
      return apiRequest("POST", "/api/activities", activityData);
    },
    onSuccess: () => {
      toast({
        title: "Activity Logged",
        description: "Your activity has been successfully recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/weekly"] });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to log activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an activity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="food">Food & Diet</SelectItem>
                      <SelectItem value="home">Home Energy</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="waste">Waste</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {activityType && (
              <FormField
                control={form.control}
                name="subtype"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {activityType === "transport" ? "Transport Type" : 
                       activityType === "food" ? "Food Type" :
                       activityType === "home" ? "Energy Type" :
                       activityType === "shopping" ? "Shopping Type" : "Waste Type"}
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activityOptions[activityType as keyof typeof activityOptions]?.subtypes.map((subtype) => (
                          <SelectItem key={subtype.value} value={subtype.value}>
                            {subtype.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {activityType && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {activityType === "transport" ? "Distance" : 
                         activityType === "food" ? "Amount" :
                         activityType === "home" ? "Usage" :
                         activityType === "shopping" ? "Quantity" : "Weight"}
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {activityType === "transport" && (
              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Passengers</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional details here" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Link href="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Log Activity"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

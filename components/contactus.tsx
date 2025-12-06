"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  dialingCode: z.string(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", dialingCode: "+251", message: "" },
  });

  // Trim values before submission
  async function onSubmit(values: ContactFormData) {
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
    };

    try {
      setStatus("sending");

      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmedValues),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit form");
      }

      setStatus("success");
      reset(); // Reset form after successful submission
    } catch (err: any) {
      console.error(err);
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4 pt-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Thrive Coworking Space</h1>
          <p className="text-gray-600 mt-2">
            Hello, please enter your contact details to get started. We will solely use this information to contact you about products and services.
          </p>
        </div>

        {/* Card with form */}
        <Card className="p-6 rounded-lg shadow-md">
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <Input
                placeholder="Enter your name"
                type="text"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {errors.name.message}
                </p>
              )}

              {/* Email */}
              <Input
                placeholder="Enter your email address"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {errors.email.message}
                </p>
              )}

              {/* Phone */}
              <div className="flex gap-0">
                <select
                  {...register("dialingCode")}
                  className="p-2 border border-r-0 rounded-l-md bg-white"
                >
                  <option value="+251">Ethiopia +251</option>
                </select>
                <Input
                  placeholder="Enter your mobile phone number"
                  type="tel"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  className="rounded-r-md border-l-0"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {errors.phone.message}
                </p>
              )}

              {/* Message */}
              <textarea
                placeholder="Enter your message"
                {...register("message")}
                className="w-full p-3 border rounded-md resize-none h-32"
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {errors.message.message}
                </p>
              )}

              {/* Privacy Policy */}
              <p className="text-xs text-gray-500 text-center">
                By submitting this form you agree to our <a href="#" className="underline">Privacy Policy</a>.
              </p>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 transition-colors"
              >
                {status === "sending" ? "Sending..." : "Send →"}
              </Button>
            </form>

            {/* Status messages */}
            {status === "success" && (
              <p className="text-center text-green-800 bg-green-100 p-2 rounded-md mt-2">
                Form submitted successfully ✓
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-red-800 bg-red-100 p-2 rounded-md mt-2">
                Failed to submit form
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

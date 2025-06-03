"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; //
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; //
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api, ContactFormData } from "@/lib/api"; // Import api and ContactFormData

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

interface ContactFormProps {
  title?: string | null;
  // You could add props for labels and button text if you want them dynamic
  // nameLabel?: string;
  // emailLabel?: string;
  // submitButtonText?: string;
}

export default function ContactForm({
  title = "Get in Touch",
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await api.submitContactForm(values); // API call
      toast({
        title: "Message Sent Successfully",
        description:
          response.data.message || "We'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      let description = "Please try again later.";
      if (error.response && error.response.data && error.response.data.errors) {
        // Handle Laravel validation errors
        const messages = Object.values(error.response.data.errors).flat();
        description = messages.join(" ");
      } else if (error.message) {
        description = error.message;
      }
      toast({
        title: "Error Sending Message",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-secondary p-8 rounded-lg">
      {title && (
        <h2 className="text-2xl font-bold mb-8 tracking-wider uppercase">
          {title}
        </h2>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* FormFields remain the same, labels could be props */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-wider text-sm font-medium">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      className="bg-white border-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-wider text-sm font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your email"
                      type="email"
                      className="bg-white border-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-wider text-sm font-medium">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Message subject"
                    className="bg-white border-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase tracking-wider text-sm font-medium">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your message"
                    className="min-h-[150px] bg-white border-none resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-primary font-bold tracking-wide"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⟳</span> Sending...
              </span>
            ) : (
              <span className="flex items-center">
                Send Message <Send className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

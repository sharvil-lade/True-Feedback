"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Copy } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";

// Renamed the function for clarity, as it's now a "Page"
function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const { username } = session.user as User;

  const baseUrl = `${
    typeof window !== "undefined"
      ? window.location.protocol + "//" + window.location.host
      : ""
  }`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-base text-gray-600 mt-1">
            Welcome back, {username}! Manage your account settings and messages.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold">Your Unique Link</h2>
            <p className="text-sm text-gray-500">
              Share this link with others to receive anonymous messages.
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2 bg-gray-100 border-gray-300 rounded-md truncate"
              />
              <Button onClick={copyToClipboard} variant="outline" size="icon">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Message Acceptance</h2>
                <p className="text-sm text-gray-500">
                  Control whether you are currently accepting new messages.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  id="accept-messages-switch"
                />
                <label
                  htmlFor="accept-messages-switch"
                  className={`text-lg font-medium ${
                    acceptMessages ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {acceptMessages ? "On" : "Off"}
                </label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Received Messages</h2>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No messages to display.</p>
              <p className="text-sm text-gray-400 mt-2">
                Share your unique link to start receiving messages!
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Ensure the component is the default export
export default DashboardPage;
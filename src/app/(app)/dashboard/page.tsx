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
import {
  Loader2,
  RefreshCcw,
  Copy,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Link as LinkIcon,
} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";

function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "flagged">("all");

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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    );
  }

  const { username } = session.user as User;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.protocol + "//" + window.location.host
      : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied!",
      description: "Profile URL copied to clipboard.",
    });
  };

  const flaggedCount = messages.filter((m) => m.isFlagged).length;
  const safeCount = messages.filter((m) => !m.isFlagged).length;
  const displayedMessages =
    activeFilter === "flagged" ? messages.filter((m) => m.isFlagged) : messages;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header banner */}
      <div className="bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Welcome back,{" "}
            <span className="text-white font-medium">@{username}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
              <p className="text-sm text-gray-500">Total Messages</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 bg-green-50 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{safeCount}</p>
              <p className="text-sm text-gray-500">Safe Messages</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{flaggedCount}</p>
              <p className="text-sm text-gray-500">Flagged Messages</p>
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile link */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-gray-500" />
              <h2 className="text-base font-semibold text-gray-800">Your Anonymous Link</h2>
            </div>
            <p className="text-xs text-gray-500">
              Share this link to receive anonymous messages.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-1 text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg truncate text-gray-600"
              />
              <Button onClick={copyToClipboard} variant="outline" size="icon" className="flex-shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Acceptance toggle */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-center">
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Message Acceptance
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Toggle to stop or resume receiving anonymous messages.
            </p>
            <div className="flex items-center gap-3">
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                id="accept-messages-switch"
              />
              <label
                htmlFor="accept-messages-switch"
                className={`text-sm font-semibold ${
                  acceptMessages ? "text-green-600" : "text-red-500"
                }`}
              >
                {acceptMessages ? "Accepting messages" : "Not accepting messages"}
              </label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Messages section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <Button
              variant="outline"
              size="sm"
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

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setActiveFilter("flagged")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "flagged"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Flagged ({flaggedCount})
            </button>
          </div>

          {displayedMessages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedMessages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  {activeFilter === "flagged" ? (
                    <ShieldCheck className="h-8 w-8 text-green-500" />
                  ) : (
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-base font-medium text-gray-700">
                {activeFilter === "flagged"
                  ? "No flagged messages"
                  : "No messages yet"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeFilter === "flagged"
                  ? "All messages passed AI content moderation."
                  : "Share your link to start receiving anonymous messages."}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;

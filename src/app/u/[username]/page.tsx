"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Loader2, Send, Wand2, ShieldCheck } from "lucide-react";

const Page = () => {
  const { username } = useParams() as { username: string };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { message: "" },
  });

  const [isSending, setIsSending] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const messageValue = watch("message");

  const onSubmit = async (data: { message: string }) => {
    setIsSending(true);
    try {
      await axios.post("/api/send-message", {
        username,
        content: data.message,
      });
      toast.success("Message sent anonymously!");
      setValue("message", "");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const isBlocked = error.response?.data?.blocked;
        const msg = error.response?.data?.message ?? "Failed to send message.";
        toast.error(isBlocked ? "Message blocked by AI moderation." : msg);
      } else {
        toast.error("Failed to send message.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleEnhance = async () => {
    const current = messageValue?.trim();
    if (!current) {
      toast.error("Write a message first, then enhance it.");
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await axios.post<{ enhanced: string; success: boolean }>(
        "/api/enhance-message",
        { content: current }
      );
      setValue("message", response.data.enhanced);
      toast.success("Message enhanced!");
    } catch {
      toast.error("Could not enhance message. Try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-1/4 h-[350px] w-[350px] rounded-full bg-sky-600 opacity-10 blur-[120px]" />
          <div className="absolute right-1/3 bottom-1/4 h-[250px] w-[250px] rounded-full bg-purple-600 opacity-10 blur-[100px]" />
        </div>

        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              True Feedback
            </h1>
            <p className="mt-2 text-gray-400">
              Send an anonymous message to{" "}
              <span className="font-semibold text-sky-400">@{username}</span>
            </p>
          </div>

          {/* Main card */}
          <div className="bg-black/50 border border-gray-700/50 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <textarea
                  {...register("message", {
                    required: "Message cannot be empty.",
                    minLength: { value: 5, message: "Message too short." },
                  })}
                  rows={5}
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl p-4 text-white placeholder:text-gray-500 text-base resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                  placeholder="Write your anonymous message here..."
                />
                <div className="flex justify-between items-center mt-1.5">
                  {errors.message ? (
                    <span className="text-red-400 text-sm">
                      {errors.message.message}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-600 ml-auto">
                    {messageValue?.length ?? 0} chars
                  </span>
                </div>
              </div>

              {/* Enhance button */}
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !messageValue?.trim()}
                className="w-full flex items-center justify-center gap-2 h-11 text-sm font-semibold bg-transparent border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all duration-200"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Enhance with AI
                  </>
                )}
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 h-12 text-base font-semibold bg-gradient-to-r from-sky-600 to-blue-700 text-white hover:opacity-90 disabled:opacity-50 rounded-xl transition-all duration-300 hover:scale-[1.01]"
              >
                {isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Anonymously
                  </>
                )}
              </button>
            </form>

            {/* AI safety note */}
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/5 border border-green-500/20 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-green-400 flex-shrink-0" />
              <p className="text-xs text-green-400/80">
                Messages are screened by AI. Harmful content is blocked automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;

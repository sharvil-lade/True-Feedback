"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Loader2, Send, RefreshCw } from "lucide-react";

const Page = () => {
  const { username } = useParams() as { username: string };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: "",
    },
  });

  const [isSending, setIsSending] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

  const onSubmit = async (data: { message: string }) => {
    setIsSending(true);
    try {
      await axios.post("/api/send-message", {
        username,
        content: data.message,
      });
      toast.success("Message sent successfully!");
      setValue("message", "");
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast.error(
        axiosError.response?.data?.message ?? "Failed to send message."
      );
    } finally {
      setIsSending(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsLoadingSuggestions(true);
    try {
      const response = await axios.get("/api/suggest-messages");
      const messages = response.data
        .split("||")
        .map((msg: string) => msg.trim().replace(/^"|"$/g, ""))
        .filter((msg: string) => msg.length > 0);
      setSuggestedMessages(messages);
      if (messages.length === 0) {
        toast.error("No suggestions available at the moment.");
      }
    } catch (error) {
      toast.error("Could not fetch suggestions. Please try again later.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSuggestionClick = (message: string) => {
    setValue("message", message);
    toast.success("Message copied to textbox!");
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              True Feedback
            </h1>
            <p className="mt-2 text-md sm:text-lg text-gray-600">
              Send an Anonymous Message to{" "}
              <span className="font-semibold text-sky-600">@{username}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea
              {...register("message", { required: "Message cannot be empty." })}
              className="border-2 border-gray-300 rounded-lg p-3 w-full h-36 resize-none text-base sm:text-lg text-gray-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              placeholder="Write your anonymous message here..."
            />
            {errors.message && (
              <span className="text-red-500 text-sm">
                {errors.message.message}
              </span>
            )}
            <button
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 h-12 text-lg font-semibold bg-sky-600 text-white hover:bg-sky-700 disabled:bg-sky-300 rounded-lg transition-all duration-300"
            >
              {isSending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" /> Send
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={fetchSuggestedMessages}
              disabled={isLoadingSuggestions}
              className="w-full flex items-center justify-center gap-2 h-12 text-lg font-semibold bg-white text-sky-600 border-2 border-sky-600 hover:bg-sky-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 rounded-lg transition-all duration-300"
            >
              {isLoadingSuggestions ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" /> Suggest Messages
                </>
              )}
            </button>
          </div>

          {suggestedMessages.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <p className="text-center text-gray-500">
                Click on a message to use it.
              </p>
              <div className="max-h-60 overflow-y-auto space-y-3 p-2 rounded-lg bg-slate-50 border">
                {suggestedMessages.map((message, index) => (
                  <div
                    onClick={() => handleSuggestionClick(message)}
                    key={index}
                    className="bg-white p-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-sky-100 hover:border-sky-300 border shadow-sm"
                  >
                    <p className="text-base text-gray-800 leading-relaxed">
                      {message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;

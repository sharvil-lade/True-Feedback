"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { Shield, Sparkles, MessageSquare, ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const features = [
  {
    icon: Shield,
    title: "100% Anonymous",
    description:
      "Senders stay completely hidden. No accounts needed to send — just a link.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Safety",
    description:
      "Every message is screened by AI before delivery. Toxic content is blocked automatically.",
  },
  {
    icon: MessageSquare,
    title: "Real Feedback",
    description:
      "People say what they actually think when they're anonymous. Get honest, unfiltered responses.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Hero */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-blue-600 opacity-10 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-purple-600 opacity-10 blur-[100px]" />
        </div>

        <section className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-400 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            AI-moderated anonymous feedback
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
            Honest Feedback,
            <br />
            Zero Identity
          </h1>
          <p className="mt-5 text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Share your link. Receive anonymous messages. Our AI screens every
            message so only meaningful feedback gets through.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 hover:scale-105 transition-all duration-300 text-base px-8"
            >
              <Link href="/sign-up">
                Get Your Free Link <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gray-700 bg-transparent text-neutral-300 hover:bg-white/5 text-base px-8"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Carousel */}
        <div className="w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto mb-16">
          <p className="text-center text-xs text-neutral-500 uppercase tracking-widest mb-4">
            What people are sending
          </p>
          <Carousel
            plugins={[Autoplay({ delay: 2500, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message) => (
                <CarouselItem key={message.title} className="p-2 sm:p-3">
                  <Card className="bg-white/5 border-gray-700/50 backdrop-blur-sm shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8 text-center min-h-[120px]">
                      <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                        &ldquo;{message.content}&rdquo;
                      </p>
                      <footer className="text-sm text-neutral-500 mt-3">
                        Received {message.received}
                      </footer>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Feature cards */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-xl bg-white/5 border border-gray-700/50 backdrop-blur-sm hover:bg-white/8 transition-colors"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg w-fit mb-4 border border-blue-500/20">
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center p-4 md:p-6 bg-gray-900 text-neutral-500 border-t border-gray-800 text-sm">
        © 2025 True Feedback · Made with ❤️ by Sharvil
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-24 bg-gray-900 text-white relative overflow-hidden">
        <section className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-4 text-base md:text-lg text-neutral-300 max-w-2xl mx-auto">
            True Feedback - Where your identity remains a secret. Explore
            messages, share your thoughts, and stay anonymous.
          </p>
          <Button
            asChild
            className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform duration-300"
          >
            <Link href="/sign-up">Get Your Anonymous Link</Link>
          </Button>
        </section>

        {/* <Carousel
          plugins={[Autoplay({ delay: 2500, stopOnInteraction: true })]}
          className="w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto"
        >
          <CarouselContent>
            {messages.map((message) => (
              <CarouselItem key={message.title} className="p-2 sm:p-4">
                <Card className="bg-black/60 border-gray-700/50 backdrop-blur-sm shadow-lg h-52 flex flex-col">
                  <CardContent className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
                    <blockquote className="space-y-3 text-center">
                      <p className="text-base sm:text-lg font-medium text-white">
                        "{message.content}"
                      </p>
                      <footer className="text-sm text-neutral-400">
                        - Received: {message.received}
                      </footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel> */}
      </main>

      {/* Footer - no changes here */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white border-t border-gray-800">
        © 2025 True Feedback. Made with ❤️ by Sharvil.
      </footer>
    </div>
  );
}

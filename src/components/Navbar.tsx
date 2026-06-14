"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { Menu, X, CircleUserRound, LayoutDashboard } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User | undefined = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 px-4 md:px-6 shadow-md bg-gray-900/95 backdrop-blur-sm text-white border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center h-14">
        <Link href="/" className="text-lg font-bold tracking-tight hover:text-gray-200 transition-colors">
          True Feedback
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <CircleUserRound className="h-4 w-4" />
                {user?.username || user?.email}
              </span>
              <Button
                onClick={() => signOut()}
                size="sm"
                variant="outline"
                className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-700 bg-transparent text-gray-300 hover:bg-white/10 hover:text-white"
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 py-4">
          <div className="flex flex-col items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <CircleUserRound className="h-4 w-4" />
                  {user?.username || user?.email}
                </span>
                <Button
                  onClick={() => signOut()}
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-700 bg-transparent text-gray-300"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in" className="w-full px-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-700 bg-transparent text-gray-300"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

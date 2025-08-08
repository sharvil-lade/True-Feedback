"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { Menu, X, CircleUserRound } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User | undefined = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          True Feedback
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <span className="flex items-center gap-2">
                <CircleUserRound />
                Welcome, {user?.username || user?.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black hover:bg-slate-200"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black hover:bg-slate-200"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col items-center gap-4">
            {session ? (
              <>
                <span className="flex items-center gap-2">
                  <CircleUserRound />
                  Welcome, {user?.username || user?.email}
                </span>
                <Button
                  onClick={() => signOut()}
                  className="w-full bg-slate-100 text-black hover:bg-slate-200"
                  variant="outline"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in" className="w-full">
                <Button
                  className="w-full bg-slate-100 text-black hover:bg-slate-200"
                  variant="outline"
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

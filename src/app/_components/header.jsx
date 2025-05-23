"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

/**
 * Header component that displays navigation and auth state
 * @param {Object} props - Component props
 * @param {Object|null} props.session - User session object or null if not authenticated
 */
export default function Header({ session }) {
  // Function to get initials from name for avatar fallback
  const getInitials = (name) => {
    if (!name) return "TD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="container flex justify-between items-center px-4 py-6 mx-auto">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Team Docs Logo" width={36} height={36} className="mr-2" />
        <span className="text-xl font-bold">Team Docs</span>
      </div>
      {/* <nav className="hidden space-x-8 md:flex">
        <Link
          href="#features"
          className="transition-colors text-muted-foreground hover:text-foreground"
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="transition-colors text-muted-foreground hover:text-foreground"
        >
          Pricing
        </Link>
        <Link
          href="#download"
          className="transition-colors text-muted-foreground hover:text-foreground"
        >
          Download
        </Link>
      </nav> */}

      <div className="flex items-center space-x-4">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative p-0 w-10 h-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarImage src={session.image} alt={session.username || "User"} />
                  <AvatarFallback className="text-sm font-medium">
                    {getInitials(session.username)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex gap-2 items-center py-2">
                <div className="flex justify-center items-center">
                  <Avatar className="w-7 h-7 border border-border">
                    <AvatarImage src={session.image} alt={session.username || "User"} />
                    <AvatarFallback className="text-sm font-medium"></AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col -space-y-0.5">
                  <p className="text-sm font-medium">{session.username || "User"}</p>
                  <p className="text-xs truncate text-muted-foreground">{session.email || ""}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex w-full cursor-pointer">
                    <Settings className="mr-2 w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onSelect={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 w-4 h-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link
              href="/auth/signin"
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Link>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";

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
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="Team Docs Logo" width={36} height={36} className="mr-2" />
        <span className="text-xl font-bold">Team Docs</span>
      </Link>

      <div className="flex items-center space-x-4">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative p-0 w-10 h-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 transition-all hover:scale-105 hover:shadow-sm"
                aria-label="User menu"
              >
                <Avatar className="w-10 h-10 border border-border/50 shadow-sm">
                  <AvatarImage
                    src={session.image}
                    alt={session.username || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-sm font-medium bg-primary/5">
                    {getInitials(session.username)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 p-0 overflow-hidden shadow-lg border-border/50"
              align="end"
              forceMount
              sideOffset={8}
            >
              {/* User Profile Section */}
              <div className="bg-muted/30 px-4 py-3 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                    <AvatarImage
                      src={session.image}
                      alt={session.username || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm font-medium bg-primary/5">
                      {getInitials(session.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold truncate">{session.username || "User"}</p>
                    <p className="text-xs truncate text-muted-foreground max-w-[180px]">
                      {session.email || ""}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs bg-background/80 border-border/50 hover:bg-background transition-colors"
                  >
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Account Settings Section */}
              <div className="p-2">
                <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground">
                  Account
                </DropdownMenuLabel>
                <ComingSoonWrapper enabled>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      asChild
                      className="px-2 py-1.5 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
                    >
                      <Link href="/settings" className="flex w-full items-center">
                        <Settings className="mr-2 w-4 h-4 text-muted-foreground" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </ComingSoonWrapper>
              </div>

              <DropdownMenuSeparator className="my-0.5" />

              {/* Sign Out Section */}
              <div className="p-2">
                <DropdownMenuItem
                  className="px-2 py-1.5 cursor-pointer rounded-md transition-colors hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive"
                  onSelect={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

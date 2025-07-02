"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut, User, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

/**
 * Admin Header Component
 * 
 * Header component for admin pages providing:
 * - Sidebar toggle functionality
 * - Admin panel branding
 * - User account dropdown with admin-specific options
 * - Quick access to admin settings
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 */
export default function AdminHeader({ user }) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getUserInitials = (user) => {
    if (!user) return "A";
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "A";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <Badge variant="secondary" className="text-xs">
            Super Admin
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            Dashboard
          </Link>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/home" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Switch to User Panel</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

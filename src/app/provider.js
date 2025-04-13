'use client';

import { SessionProvider } from "next-auth/react";

/**
 * Authentication provider component
 * Wraps the application to provide session context
 */
export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
"use client";

import { createContext, useContext, useState } from "react";

/**
 * Admin Refresh Context
 * 
 * Provides a way to trigger data refresh across all admin components
 * when the refresh button is clicked in the header.
 */
const AdminRefreshContext = createContext();

export function AdminRefreshProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AdminRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </AdminRefreshContext.Provider>
  );
}

export function useAdminRefresh() {
  const context = useContext(AdminRefreshContext);
  if (!context) {
    throw new Error("useAdminRefresh must be used within an AdminRefreshProvider");
  }
  return context;
}

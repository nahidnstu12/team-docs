"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      duration={4500}
      gap={12}
      visibleToasts={5}
      expand={true}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--success-bg": "hsl(142.1 76.2% 36.3%)",
        "--success-text": "hsl(355.7 100% 97.3%)",
        "--success-border": "hsl(142.1 76.2% 36.3%)",
        "--error-bg": "hsl(0 84.2% 60.2%)",
        "--error-text": "hsl(0 0% 98%)",
        "--error-border": "hsl(0 84.2% 60.2%)",
        "--warning-bg": "hsl(32.1 94.6% 43.7%)",
        "--warning-text": "hsl(0 0% 98%)",
        "--warning-border": "hsl(32.1 94.6% 43.7%)",
        "--info-bg": "hsl(221.2 83.2% 53.3%)",
        "--info-text": "hsl(0 0% 98%)",
        "--info-border": "hsl(221.2 83.2% 53.3%)",
      }}
      toastOptions={{
        style: {
          background: "var(--normal-bg)",
          color: "var(--normal-text)",
          border: "1px solid var(--normal-border)",
          borderRadius: "var(--radius)",
          fontSize: "14px",
          padding: "16px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          backdropFilter: "blur(8px)",
        },
        className: "toast-item",
      }}
      {...props}
    />
  );
};

export { Toaster };

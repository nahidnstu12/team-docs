"use client";

import { Spinner } from "@/components/ui/spinner";
import { useDrawerLoadingStore } from "@/stores/useDrawerLoadingStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function DrawerLoading() {
  const isDrawerReady = useDrawerLoadingStore((s) => s.isDrawerReady);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isDrawerReady) {
      // Once real drawer says "I'm ready", animate out
      const timeout = setTimeout(() => {
        setShow(false); // triggers exit animation
      }, 300); // delay for smoother transition overlap
      return () => clearTimeout(timeout);
    }
  }, [isDrawerReady]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }} // enter from bottom
          animate={{ y: 0 }} // move to position
          exit={{ y: "100%" }} // exit down (top to bottom disappearance)
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 right-0 z-[9999] w-full max-w-md h-screen bg-muted border-l shadow-lg flex items-center justify-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <Spinner size="medium">Opening Drawer...</Spinner>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

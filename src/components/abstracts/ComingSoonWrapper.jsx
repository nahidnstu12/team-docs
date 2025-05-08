"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ComingSoonWrapper({
	children,
	tooltip = "This feature is coming soon!",
	enabled = false,
	className = "",
}) {
	if (!enabled) return children;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						role="button"
						tabIndex={0}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							// toast("🚧 Feature coming soon", {
							// 	description: tooltip,
							// });
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								toast("🚧 Feature coming soon", {
									description: tooltip,
								});
							}
						}}
						className={cn(
							"relative group inline-block select-none cursor-not-allowed opacity-30 transition duration-300 ease-in-out",
							className
						)}
					>
						{/* Children get dimmed look */}
						<div className="pointer-events-none blur-[0.3px] grayscale contrast-75 brightness-90">
							{children}
						</div>

						{/* Animated Coming Soon seal */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							whileHover={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className="absolute z-20 top-2 right-2 bg-red-600 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider shadow-md pointer-events-none"
						>
							Coming Soon
						</motion.div>

						{/* Optional overlay when hovered */}
						<div className="absolute inset-0 transition duration-300 rounded-md pointer-events-none bg-gray-900/10 group-hover:bg-gray-900/20" />
					</div>
				</TooltipTrigger>
				<TooltipContent side="top">{tooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

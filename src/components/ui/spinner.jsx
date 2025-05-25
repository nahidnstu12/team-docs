"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

// Spinner container - full page layout
const spinnerVariants = cva(
	"w-full min-h-[80vh] flex flex-col items-center justify-center text-center",
	{
		variants: {
			show: {
				true: "flex",
				false: "hidden",
			},
		},
		defaultVariants: {
			show: true,
		},
	}
);

// Loader icon with gray and black colors
const loaderVariants = cva("animate-spin text-gray-700", {
	variants: {
		size: {
			small: "size-6",
			medium: "size-12",
			large: "size-28",
		},
	},
	defaultVariants: {
		size: "medium",
	},
});

export function Spinner({ size, show, children, className }) {
	return (
		<div className={cn(spinnerVariants({ show }), className)}>
			<Loader2 className={cn(loaderVariants({ size }))} />
			{children && (
				<p className="mt-3 text-3xl font-semibold tracking-tight text-gray-700">
					{children}
				</p>
			)}
		</div>
	);
}

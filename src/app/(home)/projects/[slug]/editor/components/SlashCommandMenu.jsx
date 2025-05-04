"use client";
import { useDismiss, useInteractions } from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlashCommand } from "../hooks/useSlashCommand";
import { useEffect, useRef } from "react";

export default function SlashCommandMenu({ editor }) {
	const {
		isOpen,
		groupedItems,
		floatingStyles,
		refs,
		context,
		searchQuery,
		setSearchQuery,
		selectedPosition,
	} = useSlashCommand(editor);

	const dismiss = useDismiss(context);
	const { getFloatingProps } = useInteractions([dismiss]);

	const itemRefs = useRef([]);

	useEffect(() => {
		if (itemRefs.current[0]) {
			itemRefs.current[0].scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [selectedPosition]);

	useEffect(() => {
		if (!isOpen) {
			itemRefs.current[0]?.blur(); // Remove any lingering focus state
		}
	}, [isOpen]);

	if (!editor) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={refs.setFloating}
					style={{ ...floatingStyles, minWidth: "340px", maxWidth: "400px" }}
					{...getFloatingProps()}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className="z-50 overflow-hidden bg-white border shadow-xl rounded-xl dark:bg-zinc-900"
				>
					<div className="p-3 border-b">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full px-2 py-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
							autoFocus
							placeholder="Type a command or search..."
						/>
					</div>

					<div className="py-2 overflow-y-auto max-h-96">
						{groupedItems.map(([groupName, items], groupIndex) => (
							<div key={groupName}>
								<div className="px-4 py-1 text-xs font-semibold uppercase text-muted-foreground">
									{groupName}
								</div>
								{items.map((item, itemIndex) => {
									const isSelected =
										selectedPosition.groupIndex === groupIndex &&
										selectedPosition.itemIndex === itemIndex;

									return (
										<button
											key={item.title}
											ref={(el) => {
												if (isSelected) {
													itemRefs.current[0] = el; // Always store selected item in index 0 for scrolling
												}
											}}
											type="button"
											onClick={item.command}
											className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
												isSelected ? "bg-zinc-200 dark:bg-zinc-700" : ""
											}`}
										>
											<div className="flex items-center justify-center w-6 h-6 text-muted-foreground">
												{item.icon}
											</div>
											<div>
												<div className="text-sm font-medium">{item.title}</div>
												{item.subtitle && (
													<div className="text-xs text-muted-foreground">
														{item.subtitle}
													</div>
												)}
											</div>
										</button>
									);
								})}
							</div>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

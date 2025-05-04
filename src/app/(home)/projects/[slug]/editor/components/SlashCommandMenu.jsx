"use client";
import { useDismiss, useInteractions } from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlashCommand } from "../hooks/useSlashCommand";

export default function SlashCommandMenu({ editor }) {
	const {
		isOpen,
		menuItems,
		selectedIndex,
		floatingStyles,
		refs,
		context,
		searchQuery,
		setSearchQuery,
	} = useSlashCommand(editor);

	const dismiss = useDismiss(context);
	const { getFloatingProps } = useInteractions([dismiss]);

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
						{menuItems.map((item, index) => (
							<button
								key={item.title}
								type="button"
								onClick={item.command}
								className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted transition ${
									index === selectedIndex ? "bg-muted" : ""
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
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

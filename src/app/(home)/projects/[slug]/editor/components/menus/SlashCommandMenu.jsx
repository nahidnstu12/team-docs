import { memo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlashCommand } from "../../hooks/useSlashCommand";

const SlashCommandMenu = memo(({ editor }) => {
	const {
		isOpen,
		groupedItems,
		floatingStyles,
		refs,
		searchQuery,
		setSearchQuery,
		selectedPosition,
	} = useSlashCommand(editor);

	const itemRefs = useRef([]);
	const searchInputRef = useRef(null);

	// Auto-scroll to selected item
	useAutoScroll(itemRefs, selectedPosition);
	// Cleanup focus state
	useFocusCleanup(itemRefs, isOpen);

	useGlobalShortcuts(isOpen, setSearchQuery, searchInputRef);

	if (!editor) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={refs.setFloating}
					style={{ ...floatingStyles, minWidth: "340px", maxWidth: "400px" }}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className="z-50 overflow-hidden bg-white border shadow-xl rounded-xl dark:bg-zinc-900"
				>
					<SearchInput
						value={searchQuery}
						onChange={setSearchQuery}
						inputRef={searchInputRef}
					/>

					<CommandList
						groupedItems={groupedItems}
						selectedPosition={selectedPosition}
						itemRefs={itemRefs}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
});

// Sub-components for better readability
const SearchInput = ({ value, onChange, inputRef }) => (
	<div className="p-3 border-b">
		<input
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			ref={inputRef}
			autoFocus
			placeholder="Type a command or search..."
			className="w-full px-2 py-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
		/>
	</div>
);

const CommandList = ({ groupedItems, selectedPosition, itemRefs }) => (
	<div className="py-2 overflow-y-auto max-h-96">
		{groupedItems.length === 0 ? (
			<NoResults />
		) : (
			groupedItems.map(([groupName, items], groupIndex) => (
				<CommandGroup
					key={groupName}
					groupName={groupName}
					items={items}
					groupIndex={groupIndex}
					selectedPosition={selectedPosition}
					itemRefs={itemRefs}
				/>
			))
		)}
	</div>
);

// Custom hooks for SlashCommandMenu
const useAutoScroll = (itemRefs, selectedPosition) => {
	useEffect(() => {
		if (itemRefs.current[0]) {
			itemRefs.current[0].scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [selectedPosition, itemRefs]);
};

const useFocusCleanup = (itemRefs, isOpen) => {
	useEffect(() => {
		if (!isOpen) {
			itemRefs.current[0]?.blur();
		}
	}, [isOpen, itemRefs]);
};

function CommandGroup({
	groupName,
	items,
	groupIndex,
	selectedPosition,
	itemRefs,
}) {
	return (
		<div>
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
	);
}

function NoResults() {
	return (
		<div className="px-4 py-3 text-sm text-muted-foreground">
			No matching commands
		</div>
	);
}

const useGlobalShortcuts = (isOpen, setSearchQuery, searchInputRef) => {
	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (e) => {
			// Ctrl+K or Ctrl+Enter focuses search
			if ((e.ctrlKey && e.key === "k") || (e.ctrlKey && e.key === "Enter")) {
				e.preventDefault();
				searchInputRef?.current?.focus();
				return;
			}

			// Focus input if letter/number typed
			if (
				/^[a-zA-Z0-9]$/.test(e.key) &&
				document.activeElement !== searchInputRef.current
			) {
				searchInputRef?.current?.focus();

				// Insert the key into input manually
				const currentValue = searchInputRef.current.value || "";
				searchInputRef.current.value = currentValue + e.key;
				setSearchQuery(searchInputRef.current.value);
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen, setSearchQuery, searchInputRef]);
};

export default SlashCommandMenu;

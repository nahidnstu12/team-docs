import { useState, useEffect, useMemo } from "react";
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	size,
} from "@floating-ui/react";
import { baseCommands } from "../utils/editor-command";

export const useSlashCommand = (editor, setLinkDialogOpen) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [menuItems, setMenuItems] = useState([]);
	const [menuGroups, setMenuGroups] = useState([]);
	const [selectedPosition, setSelectedPosition] = useState({
		groupIndex: 0,
		itemIndex: 0,
	});

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: "bottom-start",
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(5),
			flip(),
			shift(),
			size({
				apply({ rects, elements }) {
					Object.assign(elements.floating.style, {
						width: `${rects.reference.width}px`,
					});
				},
			}),
		],
	});

	const flattenAndFilter = (groups, query) => {
		const all = groups.flatMap((group) =>
			group.items
				.filter((item) =>
					item.keywords.some((kw) =>
						kw.toLowerCase().includes(query.toLowerCase())
					)
				)
				.map((item) => ({
					...item,
					group: group.group,
				}))
		);

		const grouped = all.reduce((acc, item) => {
			acc[item.group] = acc[item.group] || [];
			acc[item.group].push(item);
			return acc;
		}, {});

		return grouped;
	};

	const groupedItems = useMemo(() => {
		return Object.entries(
			menuItems.reduce((acc, item) => {
				acc[item.group] = acc[item.group] || [];
				acc[item.group].push(item);
				return acc;
			}, {})
		);
	}, [menuItems]);

	useEffect(() => {
		if (isOpen) {
			setSelectedPosition({ groupIndex: 0, itemIndex: 0 }); // Reset scroll index
		}
	}, [isOpen]);

	// editor get auto focus when drop down menu is closed
	useEffect(() => {
		if (!isOpen && editor?.isEditable) {
			editor.commands.focus();
		}
	}, [isOpen, editor]);

	useEffect(() => {
		if (!editor) return;

		const commands = baseCommands(editor, setLinkDialogOpen).map((group) => ({
			...group,
			items: group.items.map((item) => ({
				...item,
				command: () => {
					const { from } = editor.state.selection;
					editor
						.chain()
						.deleteRange({ from: from - 1, to: from })
						.run();
					item.command();
					setIsOpen(false);
				},
			})),
		}));

		const onKeyDown = (e) => {
			if (!editor.isFocused) return;

			if (e.key === "/") {
				// Defer to next tick to allow slash to appear in doc
				setTimeout(() => {
					const { from } = editor.state.selection;
					const textBefore = editor.state.doc.textBetween(from - 1, from, "\n");

					if (textBefore === "/") {
						// Get slash position
						const pos = editor.view.coordsAtPos(from - 1);

						const virtualElement = {
							getBoundingClientRect: () => ({
								width: 0,
								height: 0,
								x: pos.right,
								y: pos.bottom,
								top: pos.bottom,
								right: pos.right,
								bottom: pos.bottom,
								left: pos.right,
							}),
						};

						refs.setReference(virtualElement);

						setIsOpen(true);
						setSearchQuery("");
						setMenuGroups(commands);
					}
				}, 0);
			}
		};

		// Use capture phase to ensure we get the event first
		window.addEventListener("keydown", onKeyDown, { capture: true });
		return () => {
			window.removeEventListener("keydown", onKeyDown, { capture: true });
		};
	}, [editor, refs]);

	// Filtering logic
	useEffect(() => {
		if (!isOpen) return;

		const filtered = flattenAndFilter(menuGroups, searchQuery);
		const flat = Object.values(filtered).flat();
		setMenuItems(flat);

		// Recalculate grouped structure to ensure valid selection
		const newGrouped = Object.entries(
			flat.reduce((acc, item) => {
				acc[item.group] = acc[item.group] || [];
				acc[item.group].push(item);
				return acc;
			}, {})
		);

		// Always reset to the first available item if present
		if (newGrouped.length > 0 && newGrouped[0][1].length > 0) {
			setSelectedPosition({ groupIndex: 0, itemIndex: 0 });
		} else {
			// fallback for no result case
			setSelectedPosition({ groupIndex: 0, itemIndex: 0 });
		}
	}, [searchQuery, menuGroups, isOpen]);

	// Keyboard navigation
	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (e) => {
			const allowedKeys = ["ArrowDown", "ArrowUp", "Enter"];
			if (!allowedKeys.includes(e.key)) return;

			e.preventDefault(); // Only prevent if we're handling the key

			const groups = Object.entries(
				menuItems.reduce((acc, item) => {
					acc[item.group] = acc[item.group] || [];
					acc[item.group].push(item);
					return acc;
				}, {})
			);

			const maxGroupIndex = groups.length - 1;
			const currentGroup = groups[selectedPosition.groupIndex];
			const maxItemIndex = currentGroup?.[1].length - 1;

			let newGroupIndex = selectedPosition.groupIndex;
			let newItemIndex = selectedPosition.itemIndex;

			if (e.key === "ArrowDown") {
				if (newItemIndex < maxItemIndex) {
					newItemIndex++;
				} else if (newGroupIndex < maxGroupIndex) {
					newGroupIndex++;
					newItemIndex = 0;
				}
			} else if (e.key === "ArrowUp") {
				if (newItemIndex > 0) {
					newItemIndex--;
				} else if (newGroupIndex > 0) {
					newGroupIndex--;
					const newGroupItems = groups[newGroupIndex][1];
					newItemIndex = newGroupItems.length - 1;
				}
			} else if (e.key === "Enter") {
				const item = groups[newGroupIndex][1][newItemIndex];
				item?.command?.();
				setIsOpen(false);
				return;
			} else {
				return;
			}

			setSelectedPosition({
				groupIndex: newGroupIndex,
				itemIndex: newItemIndex,
			});
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isOpen, selectedPosition, menuItems]);

	return {
		isOpen,
		groupedItems,
		selectedIndex,
		floatingStyles,
		refs,
		context,
		searchQuery,
		setSearchQuery,
		selectedPosition,
		setSelectedPosition,
	};
};

import { useState, useEffect, useMemo } from "react";
import {
	useFloating,
	offset,
	flip,
	shift,
	size,
	autoUpdate,
} from "@floating-ui/react";
import { baseCommands } from "../utils/editor-command";
import { useLinkContext } from "../ctx/LinkProvider";

export const useSlashCommand = (editor) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [menuGroups, setMenuGroups] = useState([]);
	const [selectedPosition, setSelectedPosition] = useState({
		groupIndex: 0,
		itemIndex: 0,
	});

	const { linkCreateCommand } = useLinkContext();

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: "bottom-start",
		whileElementsMounted: autoUpdate,
		middleware: [offset(5), flip(), shift(), size()],
	});

	const menuItems = useMemo(
		() => filterItems(menuGroups, searchQuery),
		[menuGroups, searchQuery]
	);
	const groupedItems = useMemo(() => groupItems(menuItems), [menuItems]);

	// Initialize commands and keyboard handlers
	useCommandInitialization(
		editor,
		refs,
		setIsOpen,
		setSearchQuery,
		setMenuGroups,
		linkCreateCommand
	);
	// Handle keyboard navigation
	useKeyboardNavigation(
		isOpen,
		groupedItems,
		selectedPosition,
		setSelectedPosition,
		setIsOpen
	);
	// Handle editor focus when menu closes
	useEditorFocus(editor, isOpen);

	return {
		isOpen,
		groupedItems,
		floatingStyles,
		refs,
		searchQuery,
		setSearchQuery,
		selectedPosition,
	};
};

// Helper functions
const filterItems = (groups, query) => {
	return groups.flatMap((group) =>
		group.items
			.filter((item) =>
				item.keywords.some((kw) =>
					kw.toLowerCase().includes(query.toLowerCase())
				)
			)
			.map((item) => ({ ...item, group: group.group }))
	);
};

const groupItems = (items) => {
	const grouped = items.reduce((acc, item) => {
		acc[item.group] = acc[item.group] || [];
		acc[item.group].push(item);
		return acc;
	}, {});
	return Object.entries(grouped);
};

// Custom hooks for useSlashCommand
const useCommandInitialization = (
	editor,
	refs,
	setIsOpen,
	setSearchQuery,
	setMenuGroups,
	linkCreateCommand
) => {
	useEffect(() => {
		if (!editor) return;

		const commands = baseCommands(editor, linkCreateCommand).map((group) => ({
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
			if (!editor.isFocused || e.key !== "/") return;

			setTimeout(() => {
				const { from } = editor.state.selection;
				const textBefore = editor.state.doc.textBetween(from - 1, from, "\n");
				if (textBefore === "/") {
					const pos = editor.view.coordsAtPos(from - 1);
					refs.setReference({
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
					});
					setIsOpen(true);
					setSearchQuery("");
					setMenuGroups(commands);
				}
			}, 0);
		};

		window.addEventListener("keydown", onKeyDown, { capture: true });
		return () =>
			window.removeEventListener("keydown", onKeyDown, { capture: true });
	}, [editor, refs, setIsOpen, setMenuGroups, setSearchQuery]);
};

const useKeyboardNavigation = (
	isOpen,
	groupedItems,
	selectedPosition,
	setSelectedPosition,
	setIsOpen
) => {
	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (e) => {
			if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
			e.preventDefault();

			const { groupIndex, itemIndex } = selectedPosition;
			const maxGroupIndex = groupedItems.length - 1;
			const currentGroup = groupedItems[groupIndex];
			const maxItemIndex = currentGroup?.[1].length - 1;

			let newGroupIndex = groupIndex;
			let newItemIndex = itemIndex;

			switch (e.key) {
				case "ArrowDown": {
					if (newItemIndex < maxItemIndex) newItemIndex++;
					else if (newGroupIndex < maxGroupIndex) {
						newGroupIndex++;
						newItemIndex = 0;
					}
					break;
				}
				case "ArrowUp": {
					if (newItemIndex > 0) newItemIndex--;
					else if (newGroupIndex > 0) {
						newGroupIndex--;
						newItemIndex = groupedItems[newGroupIndex][1].length - 1;
					}
					break;
				}
				case "Enter": {
					const item = groupedItems[newGroupIndex]?.[1]?.[newItemIndex];
					item?.command?.();
					setIsOpen(false);
					return;
				}
			}

			setSelectedPosition({
				groupIndex: newGroupIndex,
				itemIndex: newItemIndex,
			});
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isOpen, selectedPosition, groupedItems, setIsOpen, setSelectedPosition]);
};

const useEditorFocus = (editor, isOpen) => {
	useEffect(() => {
		if (!isOpen && editor?.isEditable) {
			editor.commands.focus();
		}
	}, [isOpen, editor]);
};

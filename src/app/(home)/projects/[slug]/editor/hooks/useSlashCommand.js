import { useState, useEffect } from "react";
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	size,
} from "@floating-ui/react";
import { baseCommands } from "../utils/editor-command";

export const useSlashCommand = (editor) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [menuItems, setMenuItems] = useState([]);
	const [menuStack, setMenuStack] = useState([]);

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

	// remove slash after selecting an item
	const withSlashRemoval = (command) => {
		return () => {
			const { from } = editor.state.selection;
			const slashPos = from - 1;

			// First delete the slash
			editor.chain().deleteRange({ from: slashPos, to: from }).run();

			// Then execute the original command
			command();

			// Close the menu
			setIsOpen(false);
		};
	};

	// editor get auto focus when drop down menu is closed
	useEffect(() => {
		if (!isOpen && editor?.isEditable) {
			editor.commands.focus();
		}
	}, [isOpen, editor]);

	useEffect(() => {
		if (!editor) return;

		const commands = baseCommands(editor);

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

						const processedCommands = commands.map((cmd) => ({
							...cmd,
							command: withSlashRemoval(cmd.command),
						}));

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
						setMenuStack([commands, processedCommands]);
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
		const currentMenu = menuStack[menuStack.length - 1];
		const filtered = currentMenu.filter((item) =>
			item.keywords.some((kw) => kw.includes(searchQuery.toLowerCase()))
		);
		setMenuItems(filtered);
		setSelectedIndex(0);
	}, [searchQuery, menuStack, isOpen]);

	// Keyboard navigation
	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (e) => {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) => (prev + 1) % menuItems.length);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex(
					(prev) => (prev - 1 + menuItems.length) % menuItems.length
				);
			} else if (e.key === "Enter") {
				e.preventDefault();
				if (menuItems[selectedIndex]) {
					menuItems[selectedIndex].command();
					setIsOpen(false);
				}
			} else if (e.key === "Escape") {
				e.preventDefault();
				if (menuStack.length > 1) {
					setMenuStack((prev) => prev.slice(0, -1));
				} else {
					setIsOpen(false);
				}
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isOpen, selectedIndex, menuItems, menuStack]);

	return {
		isOpen,
		menuItems,
		selectedIndex,
		floatingStyles,
		refs,
		context,
		searchQuery,
		setSearchQuery,
	};
};

"use client";

import {
	Heading1,
	Heading2,
	Heading3,
	Bold as BoldIcon,
	Italic as ItalicIcon,
	List as ListIcon,
	ListOrdered as ListOrderedIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function RTEslash({ editor }) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const inputRef = useRef();
	const containerRef = useRef();
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	const allCommands = [
		{
			label: "Heading 1",
			icon: Heading1,
			keywords: ["h1", "heading", "title"],
			run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
		},
		{
			label: "Heading 2",
			icon: Heading2,
			keywords: ["h2", "heading", "subtitle"],
			run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
		},
		{
			label: "Heading 3",
			icon: Heading3,
			keywords: ["h3", "heading"],
			run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
		},
		{
			label: "Bold",
			icon: BoldIcon,
			keywords: ["bold", "strong", "b"],
			run: () => editor.chain().focus().toggleBold().run(),
		},
		{
			label: "Italic",
			icon: ItalicIcon,
			keywords: ["italic", "i", "em"],
			run: () => editor.chain().focus().toggleItalic().run(),
		},
		{
			label: "Bullet List",
			icon: ListIcon,
			keywords: ["list", "bullet"],
			run: () => editor.chain().focus().toggleBulletList().run(),
		},
		{
			label: "Numbered List",
			icon: ListOrderedIcon,
			keywords: ["number", "list", "ordered"],
			run: () => editor.chain().focus().toggleOrderedList().run(),
		},
		// Add more here...
	];

	const filtered = allCommands.filter((cmd) =>
		cmd.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))
	);

	const closeMenu = useCallback(() => {
		setOpen(false);
		setQuery("");
		setSelectedIndex(0);
	}, []);

	const handleKeyDown = useCallback(
		(e) => {
			if (!open) return;

			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) => (prev + 1) % filtered.length);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex(
					(prev) => (prev - 1 + filtered.length) % filtered.length
				);
			} else if (e.key === "Enter") {
				e.preventDefault();
				filtered[selectedIndex]?.run();
				closeMenu();
			} else if (e.key === "Escape") {
				e.preventDefault();
				closeMenu();
			}
		},
		[open, filtered, selectedIndex, closeMenu]
	);

	const openMenu = () => {
		const { from } = editor.state.selection;
		const start = editor.view.coordsAtPos(from);

		setCoords({
			top: start.top + window.scrollY,
			left: start.left + window.scrollX,
		});
		setOpen(true);
		setQuery("");
		setSelectedIndex(0);
		setTimeout(() => inputRef.current?.focus(), 10);
	};

	useEffect(() => {
		const listener = (e) => {
			if (e.key === "/" && editor?.isFocused) {
				e.preventDefault();
				openMenu();
			}
		};

		window.addEventListener("keydown", listener);
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", listener);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [editor, filtered, selectedIndex, handleKeyDown]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				closeMenu();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [closeMenu]);

	if (!open || !editor) return null;

	return (
		<Card
			ref={containerRef}
			style={{
				position: "absolute",
				top: coords.top + 20, // slight offset below caret
				left: coords.left,
				zIndex: 999,
			}}
			className="absolute z-50 border shadow-lg top-2 left-2 w-72"
		>
			<CardContent className="p-2 space-y-2">
				<Input
					ref={inputRef}
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setSelectedIndex(0);
					}}
					placeholder="Search commands..."
					className="text-sm"
				/>
				<div className="overflow-y-auto max-h-64">
					{filtered.length > 0 ? (
						filtered.map((item, i) => {
							const Icon = item.icon;
							return (
								<div
									key={i}
									className={cn(
										"flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm",
										selectedIndex === i
											? "bg-muted text-accent-foreground"
											: "hover:bg-accent"
									)}
									onMouseEnter={() => setSelectedIndex(i)}
									onClick={() => {
										item.run();
										closeMenu();
									}}
								>
									<Icon className="w-4 h-4" />
									<span>{item.label}</span>
								</div>
							);
						})
					) : (
						<p className="p-2 text-sm text-muted-foreground">
							No results found
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

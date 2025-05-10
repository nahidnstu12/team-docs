"use client";
import { useEffect } from "react";

const textColors = [
	{ name: "Red", color: "#ef4444" },
	{ name: "Green", color: "#22c55e" },
	{ name: "Blue", color: "#3b82f6" },
	{ name: "Yellow", color: "#eab308" },
	{ name: "Purple", color: "#8b5cf6" },
	{ name: "Gray", color: "#6b7280" },
];

const bgColors = [
	{ name: "Red", color: "#fee2e2" },
	{ name: "Green", color: "#dcfce7" },
	{ name: "Blue", color: "#dbeafe" },
	{ name: "Yellow", color: "#fef9c3" },
	{ name: "Purple", color: "#ede9fe" },
	{ name: "Gray", color: "#f3f4f6" },
];

export default function ColorPickerPanel({ editor, onClose }) {
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest(".color-picker-panel")) {
				onClose();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

	const applyTextColor = (color) => {
		editor.chain().focus().setColor(color).run();
		onClose();
	};

	const applyHighlight = (color) => {
		editor.chain().focus().toggleHighlight({ color }).run();
		onClose();
	};

	return (
		<div className="absolute left-0 top-2 z-50 w-[300px] p-4 bg-white border border-gray-200 rounded-xl shadow-2xl color-picker-panel space-y-4">
			<div>
				<p className="mb-2 text-sm font-semibold text-gray-800">Text Color</p>
				<div className="flex flex-wrap gap-3">
					{textColors.map(({ name, color }) => (
						<button
							key={name}
							onClick={() => applyTextColor(color)}
							className="w-8 h-8 transition-all duration-150 border border-gray-300 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-gray-400"
							style={{ backgroundColor: color }}
							title={name}
						/>
					))}
				</div>
			</div>

			<div>
				<p className="mb-2 text-sm font-semibold text-gray-800">Highlight</p>
				<div className="flex flex-wrap gap-3">
					{bgColors.map(({ name, color }) => (
						<button
							key={name}
							onClick={() => applyHighlight(color)}
							className="w-8 h-8 transition-all duration-150 border border-gray-300 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-yellow-400"
							style={{ backgroundColor: color }}
							title={name}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

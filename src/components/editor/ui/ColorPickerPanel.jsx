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
		<div className="absolute left-0 z-50 w-64 p-3 mt-2 bg-white border rounded-md shadow-lg color-picker-panel top-full">
			<div>
				<p className="mb-1 text-sm font-medium text-gray-700">Text Color</p>
				<div className="flex flex-wrap gap-2 mb-3">
					{textColors.map(({ name, color }) => (
						<button
							key={name}
							onClick={() => applyTextColor(color)}
							className="w-6 h-6 border rounded-full"
							style={{ backgroundColor: color }}
							title={name}
						/>
					))}
				</div>
			</div>
			<div>
				<p className="mb-1 text-sm font-medium text-gray-700">
					Background Color
				</p>
				<div className="flex flex-wrap gap-2">
					{bgColors.map(({ name, color }) => (
						<button
							key={name}
							onClick={() => applyHighlight(color)}
							className="w-6 h-6 border rounded-full"
							style={{ backgroundColor: color }}
							title={name}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

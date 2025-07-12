"use client";
import { useEffect } from "react";
import { X, RotateCcw } from "lucide-react";

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

  // Get current colors
  const currentTextColor = editor.getAttributes("textStyle")?.color;
  const currentHighlight = editor.getAttributes("highlight")?.color;

  const applyTextColor = (color, event) => {
    event?.stopPropagation();
    editor.chain().focus().setColor(color).run();
    onClose();
  };

  const removeTextColor = (event) => {
    event?.stopPropagation();
    editor.chain().focus().unsetColor().run();
    onClose();
  };

  const applyHighlight = (color, event) => {
    event?.stopPropagation();
    editor.chain().focus().toggleHighlight({ color }).run();
    onClose();
  };

  const removeHighlight = (event) => {
    event?.stopPropagation();
    editor.chain().focus().unsetHighlight().run();
    onClose();
  };

  return (
    <div
      className="absolute left-0 top-2 z-50 w-[300px] p-4 bg-white border border-gray-200 rounded-xl shadow-2xl color-picker-panel space-y-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-800">Text Color</p>
          {currentTextColor && (
            <button
              onClick={(e) => removeTextColor(e)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Remove text color"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Default/No color option */}
          <button
            onClick={(e) => removeTextColor(e)}
            className={`w-8 h-8 transition-all duration-150 border-2 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 flex items-center justify-center ${
              !currentTextColor ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
            }`}
            title="Default (no color)"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          {textColors.map(({ name, color }) => (
            <button
              key={name}
              onClick={(e) => applyTextColor(color, e)}
              className={`w-8 h-8 transition-all duration-150 border-2 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 ${
                currentTextColor === color
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              title={`${name}${currentTextColor === color ? " (current)" : ""}`}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-800">Highlight</p>
          {currentHighlight && (
            <button
              onClick={(e) => removeHighlight(e)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Remove highlight"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Default/No highlight option */}
          <button
            onClick={(e) => removeHighlight(e)}
            className={`w-8 h-8 transition-all duration-150 border-2 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 flex items-center justify-center ${
              !currentHighlight ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
            }`}
            title="No highlight"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          {bgColors.map(({ name, color }) => (
            <button
              key={name}
              onClick={(e) => applyHighlight(color, e)}
              className={`w-8 h-8 transition-all duration-150 border-2 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-yellow-400 ${
                currentHighlight === color
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              title={`${name}${currentHighlight === color ? " (current)" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

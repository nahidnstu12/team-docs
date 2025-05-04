export default function EditorFooter({ editor }) {
	if (!editor) return null;

	const charLimit = 10_000; // sync with your config
	const charCount = editor.storage.characterCount.characters();
	const wordCount = editor.storage.characterCount.words();
	// const remaining = charLimit - charCount;

	const overLimit = charCount > charLimit;

	return (
		<div
			className={`pt-2 text-xs text-right ${
				overLimit ? "text-red-500" : "text-muted-foreground"
			}`}
		>
			{wordCount} words · {charCount}/{charLimit} characters
		</div>
	);
}

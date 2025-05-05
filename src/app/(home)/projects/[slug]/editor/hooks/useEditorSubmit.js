import { useRef } from "react";

export const useEditorSubmit = (editor) => {
	const ref = useRef(null);

	const handleSubmit = () => {
		if (!editor) return;
		const content = JSON.stringify(editor.getJSON());
		ref.current.value = content;
		ref.current.form.requestSubmit();
	};

	return { ref, handleSubmit };
};

import { createContext, useContext, useMemo, useState } from "react";

export const LinkContext = createContext();

export const LinkProvider = ({ children }) => {
	const [linkDialogOpen, setLinkDialogOpen] = useState(false);
	const [initialText, setInitialText] = useState("");
	const [initialUrl, setInitialUrl] = useState("");
	const [dialogMode, setDialogMode] = useState("create");

	// 👇 This function encapsulates all logic needed for link creation
	const linkCreateCommand = () => {
		setInitialText("");
		setInitialUrl("");
		setDialogMode("create");
		setLinkDialogOpen(true); // this replaces onOpenChange(true)
	};

	const value = useMemo(
		() => ({
			linkDialogOpen,
			setLinkDialogOpen,
			initialText,
			setInitialText,
			initialUrl,
			setInitialUrl,
			dialogMode,
			setDialogMode,
			linkCreateCommand, // 👈 expose the function in context
		}),
		[linkDialogOpen, initialText, initialUrl, dialogMode]
	);

	return <LinkContext.Provider value={value}>{children}</LinkContext.Provider>;
};

export const useLinkContext = () => {
	const context = useContext(LinkContext);
	if (!context) {
		throw new Error("useLinkContext must be used within an LinkProvider");
	}
	return context;
};

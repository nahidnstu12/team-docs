"use client";
import {
	ChevronDown,
	Copy,
	FileText,
	FolderKanban,
	Home,
	MoreHorizontal,
	Pencil,
	Settings,
	Trash,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { cn } from "@/lib/utils";
import { usePageDialogStore } from "@/app/(home)/projects/store/usePageDialogStore";
import { motion, AnimatePresence } from "framer-motion";
import { useSectionDialogStore } from "@/app/(home)/projects/[slug]/editor/store/useSectionDialogStore";

export default function ProjectEditorSidebar() {
	const router = useRouter();
	const sections = useProjectStore((state) => state.sections);
	const setSelectedSection = useProjectStore(
		(state) => state.setSelectedSection
	);
	const selectedPage = useProjectStore((state) => state.selectedPage);
	const setSelectedPage = useProjectStore((state) => state.setSelectedPage);
	const openSectionDialog = useSectionDialogStore(
		(state) => state.openSectionDialog
	);

	const [openSections, setOpenSections] = useState({});

	const toggleSection = (sectionId) => {
		setOpenSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId],
		}));
		// setSelectedSection(sectionId);
	};

	return (
		<Sidebar className="bg-white border-r">
			<SidebarContent className="flex flex-col h-full">
				{/* HOME BUTTON */}
				<div className="px-2 pt-3">
					<Button
						variant="ghost"
						className="justify-start w-full px-2 py-2 text-sm transition rounded-md text-muted-foreground hover:bg-gray-100 hover:text-primary"
						onClick={() => {
							router.push("/home");
							router.refresh();
						}}
					>
						<Home className="w-4 h-4 mr-2" />
						Go to Home
					</Button>
				</div>

				{/* Divider */}
				<div className="px-3">
					<div className="my-2 border-t border-gray-200" />
				</div>

				{/* MAIN MENU */}
				<SidebarMenu className="flex-1 px-2 mt-2 space-y-2 overflow-y-auto">
					{sections.length === 0 ? (
						// Empty state fallback
						<div className="p-4 mx-2 mt-4 text-xs text-gray-500 bg-gray-100 rounded">
							No sections yet. Create one to get started.
						</div>
					) : (
						sections.map((section) => (
							<SidebarMenuItem key={section.id} className="relative group">
								<SidebarMenuButton
									onClick={() => toggleSection(section.id)}
									className={cn(
										"flex items-center justify-between w-full p-2 transition rounded-xs hover:bg-gray-200/30",
										section.pages?.some((p) => p.id === selectedPage) &&
											"bg-blue-100" // ✅ only highlight section if a page inside it is selected
									)}
								>
									<div className="flex items-center gap-2">
										<ChevronDown
											className={cn(
												"w-4 h-4 text-muted-foreground transition-transform duration-300",
												openSections[section.id] ? "rotate-0" : "-rotate-90"
											)}
										/>
										<FolderKanban className="w-4 h-4" />
										<TooltipProvider delayDuration={300}>
											<Tooltip>
												<TooltipTrigger asChild>
													<span className="truncate max-w-[160px] text-sm text-gray-800 block">
														{section.name}
													</span>
												</TooltipTrigger>
												<TooltipContent className="max-w-xs text-xs break-words">
													{section.name}
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</SidebarMenuButton>

								{/* Section Menu */}
								<DropdownMenu
									onOpenChange={() => setSelectedSection(section.id)}
								>
									<DropdownMenuTrigger asChild>
										<SidebarMenuAction className="absolute right-2 top-2">
											<MoreHorizontal className="w-4 h-4" />
										</SidebarMenuAction>
									</DropdownMenuTrigger>
									<AnimatePresence>
										<motion.div
											initial={{ opacity: 0, x: 50 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 50 }}
											transition={{ duration: 0.2, ease: "easeInOut" }}
										>
											<DropdownMenuContent
												side="right"
												align="start"
												className={cn(
													"overflow-hidden transition-all duration-500 ease-in-out",
													"data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-left-4",
													"data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-left-4"
												)}
											>
												<DropdownMenuItem
													onClick={() =>
														usePageDialogStore.getState().openPageDialog()
													}
												>
													<FileText className="w-4 h-4 mr-2 text-blue-500" />
													Create Page
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Settings className="w-4 h-4 mr-2 text-yellow-500" />
													Update Section
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Trash className="w-4 h-4 mr-2 text-red-500" />
													Delete Section
												</DropdownMenuItem>
											</DropdownMenuContent>
										</motion.div>
									</AnimatePresence>
								</DropdownMenu>

								{/* Pages under section */}
								<AnimatePresence initial={false}>
									{openSections[section.id] && section.pages?.length > 0 && (
										<motion.div
											key="pages"
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3, ease: "easeInOut" }}
											className="overflow-hidden ml-4 mt-0.5 bg-gray-200/30"
										>
											<SidebarMenuSub className="transition-all duration-300 ease-in-out overflow-hidden max-h-[1000px] px-0 mx-0 ml-4 mt-0.5 space-y-1">
												{section.pages.map((page) => (
													<SidebarMenuSubItem
														key={page.id}
														className="relative w-full group"
													>
														<SidebarMenuSubButton
															asChild
															className={cn(
																"flex items-center w-full p-2 rounded-xs transition hover:bg-muted",
																selectedPage === page.id &&
																	"bg-gray-200/40 text-primary font-semibold"
															)}
														>
															<a
																href="#"
																onClick={() => {
																	setSelectedSection(section.id);
																	setSelectedPage(page.id);
																}}
																className="flex items-center w-full gap-2"
															>
																<FileText className="w-4 h-4 text-muted-foreground" />
																<TooltipProvider delayDuration={300}>
																	<Tooltip>
																		<TooltipTrigger asChild>
																			<span className="truncate max-w-[140px] block">
																				{page.title || "Untitled Page"}
																			</span>
																		</TooltipTrigger>
																		<TooltipContent className="max-w-xs text-xs break-words">
																			{page.title || "Untitled Page"}
																		</TooltipContent>
																	</Tooltip>
																</TooltipProvider>
															</a>
														</SidebarMenuSubButton>

														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<SidebarMenuAction className="absolute -translate-y-1/2 right-2 top-1/2">
																	<MoreHorizontal className="w-4 h-4" />
																</SidebarMenuAction>
															</DropdownMenuTrigger>
															<DropdownMenuContent side="right" align="start">
																<DropdownMenuItem>
																	<Copy className="w-4 h-4 mr-2 text-blue-500" />
																	Duplicate
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<Pencil className="w-4 h-4 mr-2 text-green-500" />
																	Update
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<Trash className="w-4 h-4 mr-2 text-red-500" />
																	Delete
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<Settings className="w-4 h-4 mr-2 text-yellow-500" />
																	Settings
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</motion.div>
									)}
								</AnimatePresence>
							</SidebarMenuItem>
						))
					)}
				</SidebarMenu>

				{/* create section button */}
				<div className="sticky bottom-0 px-2 py-3 bg-white border-t">
					<Button
						variant="ghost"
						className="justify-start w-full text-sm text-muted-foreground hover:text-primary hover:bg-gray-100"
						onClick={openSectionDialog}
					>
						<FolderKanban className="w-4 h-4 mr-2 text-gray-500" />
						Create Section
					</Button>
				</div>
			</SidebarContent>
		</Sidebar>
	);
}

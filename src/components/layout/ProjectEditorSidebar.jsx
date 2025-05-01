"use client";
import {
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
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { cn } from "@/lib/utils";
import { usePageDialogStore } from "@/app/(home)/projects/store/usePageDialogStore";

export default function ProjectEditorSidebar() {
	const router = useRouter();
	const sections = useProjectStore((state) => state.sections);
	const selectedSection = useProjectStore((state) => state.selectedSection);
	const setSelectedSection = useProjectStore(
		(state) => state.setSelectedSection
	);

	const [openSections, setOpenSections] = useState({});

	const toggleSection = (sectionId) => {
		setOpenSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId],
		}));
		setSelectedSection(sectionId);
	};

	return (
		<Sidebar className="bg-white border-r">
			<SidebarContent className="flex flex-col h-full">
				{/* HOME BUTTON */}
				<div className="p-3">
					<Button
						variant="outline"
						className="justify-start w-full text-gray-600 transition hover:bg-gray-100"
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
										selectedSection === section.id && "bg-blue-100"
									)}
								>
									<div className="flex items-center gap-2">
										<FolderKanban className="w-4 h-4" />
										<span>{section.name}</span>
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
									<DropdownMenuContent side="right" align="start">
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
								</DropdownMenu>

								{/* Pages under section */}
								{openSections[section.id] && section.pages?.length > 0 && (
									<SidebarMenuSub className="transition-all duration-300 ease-in-out overflow-hidden max-h-[1000px] px-0 mx-0 ml-4 mt-0.5 space-y-1 border-l border-gray-200 bg-gray-200/30">
										{section.pages.map((page) => (
											<SidebarMenuSubItem
												key={page.id}
												className="relative w-full group"
											>
												<SidebarMenuSubButton
													asChild
													className="flex items-center w-full p-2 transition-all rounded-xs hover:bg-gray-200/40"
												>
													<a
														href="#"
														className="flex items-center w-full gap-2"
													>
														<FileText className="w-4 h-4 text-muted-foreground" />
														{page.title || "Untitled Page"}
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
								)}
							</SidebarMenuItem>
						))
					)}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}

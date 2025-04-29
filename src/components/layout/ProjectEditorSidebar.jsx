"use client";
import {
	FileText,
	FolderKanban,
	MoreHorizontal,
	Pencil,
	Plus,
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
import Link from "next/link";
import { Button } from "../ui/button";

/**
 * when  we fetch section from the db, we will update the state & its render logic like this
 * const [openSections, setOpenSections] = useState({});

 * const toggleSection = (id) => {
 * setOpenSections((prev) => ({
 *	...prev,
 *	[id]: !prev[id], // Toggle specific section by ID
 *  }));
 * };
 *
 *
 * {sections.map((section) => (
	<div key={section.id}>
		<button onClick={() => toggleSection(section.id)}>
			{section.name}
		</button>

		{openSections[section.id] && (
			<ul>
				<li>Sub Page 1</li>
				<li>Sub Page 2</li>
			</ul>
		)}
	</div>
))}
 
 */

export default function ProjectEditorSidebar() {
	const [openSection, setOpenSection] = useState({
		section1: true,
		section2: false,
	});

	const toggleSection = (key) =>
		setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));

	return (
		<Sidebar className="border-r">
			<SidebarContent>
				<Button
					variant="link"
					className="justify-start mx-2 my-2 text-gray-600"
					asChild
				>
					<Link href="/home">go to home</Link>
				</Button>

				<SidebarMenu className="px-2 mt-6 space-y-2">
					{/* SECTION 1 */}
					<SidebarMenuItem className="relative group">
						{/* Section Button */}
						<SidebarMenuButton
							onClick={() => toggleSection("section1")}
							className="flex items-center justify-between w-full p-2 transition rounded-xs bg-gray-200/40 hover:bg-gray-200/30"
						>
							<div className="flex items-center gap-2">
								<FolderKanban className="w-4 h-4" />
								<span>Section 1</span>
							</div>
						</SidebarMenuButton>

						{/* Section Actions */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction className="absolute right-2 top-2">
									<MoreHorizontal className="w-4 h-4" />
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="right" align="start">
								<DropdownMenuItem>
									<Plus className="w-4 h-4 mr-2 text-pink-500" />
									Create Section
								</DropdownMenuItem>
								<DropdownMenuItem>
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

						{/* Section Pages */}
						{openSection.section1 && (
							<SidebarMenuSub className="transition-all duration-300 ease-in-out overflow-hidden max-h-[1000px] px-0 mx-0 ml-4 mt-0.5 space-y-1 border-l border-gray-200 bg-gray-200/30">
								{/* Page 1 */}
								<SidebarMenuSubItem className="relative flex items-center w-full group">
									<SidebarMenuSubButton
										asChild
										className="flex items-center w-full p-2 transition-all rounded-xs hover:bg-gray-200/40"
									>
										<a href="#" className="flex items-center w-full gap-2">
											<FileText className="w-4 h-4 text-muted-foreground" />
											Page 1
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
												<Pencil className="w-4 h-4 mr-2 text-green-500" />
												Update Page
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Trash className="w-4 h-4 mr-2 text-red-500" />
												Delete Page
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</SidebarMenuSubItem>

								{/* Page 2 */}
								<SidebarMenuSubItem className="relative w-full group">
									<SidebarMenuSubButton
										asChild
										className="flex items-center w-full p-2 transition-all rounded-xs hover:bg-gray-200/40"
									>
										<a href="#" className="flex items-center w-full gap-2">
											<FileText className="w-4 h-4 text-muted-foreground" />
											Page 2
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
												<Pencil className="w-4 h-4 mr-2 text-green-500" />
												Update Page
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Trash className="w-4 h-4 mr-2 text-red-500" />
												Delete Page
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</SidebarMenuSubItem>
							</SidebarMenuSub>
						)}
					</SidebarMenuItem>

					{/* SECTION 2 (Same logic) */}
					<SidebarMenuItem className="relative group">
						<SidebarMenuButton
							onClick={() => toggleSection("section2")}
							className="flex items-center justify-between w-full p-2 transition rounded-md bg-gray-200/40 hover:bg-gray-200/30"
						>
							<div className="flex items-center gap-2">
								<FolderKanban className="w-4 h-4" />
								<span>Section 2</span>
							</div>
						</SidebarMenuButton>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction className="absolute right-2 top-2">
									<MoreHorizontal className="w-4 h-4" />
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="right" align="start">
								<DropdownMenuItem>
									<Plus className="w-4 h-4 mr-2 text-pink-500" />
									Create Section
								</DropdownMenuItem>
								<DropdownMenuItem>
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

						{openSection.section2 && (
							<SidebarMenuSub className="transition-all duration-300 ease-in-out overflow-hidden max-h-[1000px] px-0 mx-0 ml-4 mt-0.5 space-y-1 border-l border-gray-200 bg-gray-200/30">
								<SidebarMenuSubItem className="relative w-full group">
									<SidebarMenuSubButton
										asChild
										className="flex items-center w-full p-2 transition-all rounded-xs hover:bg-gray-200/40"
									>
										<a href="#" className="flex items-center w-full gap-2">
											<FileText className="w-4 h-4 text-muted-foreground" />
											Page A
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
												<Pencil className="w-4 h-4 mr-2 text-green-500" />
												Update Page
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Trash className="w-4 h-4 mr-2 text-red-500" />
												Delete Page
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</SidebarMenuSubItem>
							</SidebarMenuSub>
						)}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}

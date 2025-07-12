import { FileText } from "lucide-react";

export default function NoPageSelectedUI() {
	return (
		<div className="absolute inset-0 flex items-center justify-center" style={{ top: '64px', bottom: 0, left: 0, right: 0 }}>
			<div className="flex flex-col items-center justify-center gap-4 text-center max-w-md">
				<FileText 
					className="w-32 h-32 text-muted-foreground/20 stroke-[0.5]" 
					style={{ opacity: 0.8 }}
				/>
				<h2 className="text-4xl font-extralight tracking-wider text-muted-foreground/40">
					No Page Selected
				</h2>
				<p className="text-sm text-muted-foreground/60 max-w-xs">
					Select a page from the sidebar or create a new one to get started
				</p>
			</div>
		</div>
	);
}

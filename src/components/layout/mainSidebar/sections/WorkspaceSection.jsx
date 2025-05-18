// components/layout/mainSidebar/sections/WorkspaceSection.jsx
"use client";

import { LayoutDashboard } from "lucide-react";
import DirectLinkItem from "../DirectLinkItem";

export default function WorkspaceSection({ sectionId }) {
    return (
        <DirectLinkItem
            href="/workspace"
            icon={LayoutDashboard}
            label="Workspace"
            sectionId={sectionId}
        />
    );
}
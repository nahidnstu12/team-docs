"use client";

import { Home } from "lucide-react";
import DirectLinkItem from "../DirectLinkItem";

export default function HomeSection({ sectionId }) {
    return (
        <DirectLinkItem
            href="/home"
            icon={Home}
            label="Home"
            sectionId={sectionId}
        />
    );
}
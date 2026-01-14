'use client'

import { useArtifactsJson } from "@/app/components/ArtifactsJsonContext";
import type { Artifacts } from "../types";

type Args = {
    artifacts: Artifacts,
    filterOpts: FilterOpts
}

export default function ArtifactsList({ artifacts, filterOpts }: Args) {
    
}

'use client'
import { createContext, useContext, useState } from 'react';
// TODO: Remove this testing logic
// import data from "@/testing/artifacts_data.json"

export interface RawSkill {
    skill_id: number;
    skill_quality: number;
    level: number;
    name: string;
    is_max_quality: boolean;
    effect_value: string;
    icon_image: string;
}

export interface RawArtifact {
    weapon_group: string;
    element: string;
    is_scrap: boolean;
    s1: RawSkill;
    s2: RawSkill;
    s3: RawSkill;
    s4: RawSkill;
    name: string;
}

export interface RawArtifactData {
    [id: string]: string;
}

interface RawArtifactDataContextType {
    artifactsJSON: Record<string, RawArtifact> | null;
    setArtifactsJSON: (file: File) => Promise<void>;
}

const ArtifactsJSONContext = createContext<RawArtifactDataContextType | undefined>(undefined);

export function ArtifactsJSONProvider({ children }: { children: React.ReactNode }) {
    const [artifactsJSON, setArtifactsJSON] = useState<Record<string, RawArtifact> | null>(null);

    const setArtifactsFromFile = async (file: File) => {
        const text = await file.text(); 
        const rawData: RawArtifactData = JSON.parse(text); 

        const parsed: Record<string, RawArtifact> = Object.fromEntries(
            Object.entries(rawData).map(([id, artifactStr]) => [id, JSON.parse(artifactStr)])
        );

        setArtifactsJSON(parsed);
    };

    return (
        <ArtifactsJSONContext.Provider value={{ artifactsJSON: artifactsJSON, setArtifactsJSON: setArtifactsFromFile }}>
            {children}
        </ArtifactsJSONContext.Provider>
    );
}

export const useArtifactsJSON = () => {
  const context = useContext(ArtifactsJSONContext);
  if (!context) throw new Error("useArtifacts must be used within ArtifactsJSONProvider");
  return context;
};
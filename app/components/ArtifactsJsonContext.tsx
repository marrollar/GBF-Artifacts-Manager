
'use client'
import { createContext, useContext, useState } from 'react';
// TODO: Remove this testing logic
import data from "@/testing/artifacts_data.json"

const ArtifactsJsonContext = createContext(null);
export const useArtifactsJson = () => useContext(ArtifactsJsonContext);

export const ArtifactsJsonProvider = ({ children }) => {
    const [jsonData, setJsonData] = useState(data);

    return (
        <ArtifactsJsonContext.Provider value={{ jsonData, setJsonData }}>
            {children}
        </ArtifactsJsonContext.Provider>
    )
}
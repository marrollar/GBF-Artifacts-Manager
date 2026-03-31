'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useArtifactsJSON } from './ArtifactsJsonContext';

export default function FileUpload() {
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState('');
    const { setArtifactsJSON } = useArtifactsJSON();
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type === 'application/json' || file.name.endsWith('.json')) {
            try {
                await setArtifactsJSON(file);
                setError("")
                setFileName(file.name)
                router.push("/viewer")
            }
            catch (err) {
                setError("File was not parseable as json.")
                setFileName("");
                console.error("Failed to load JSON", err)
            }
        } else {
            setError('File input should be json.');
            setFileName("");
        }
    }

    return (
        <>
            <input
                type="file"
                className="file-input file-input-primary"
                onChange={handleFileChange}></input>
            {
                fileName && (
                    <p className="text-gray-700">Selected file: {fileName}</p>
                )
            }
            {error && (
                <p
                    style={{
                        animation: 'pulse 1s 1'
                    }}
                    className="text-red-500 mt-2">{error}</p>
            )}
        </>

    )
}

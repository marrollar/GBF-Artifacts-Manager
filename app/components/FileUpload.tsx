'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useArtifactsJson } from './ArtifactsJsonContext';

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const {setJsonData} = useArtifactsJson();
    const router = useRouter();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type === 'application/json' || file.name.endsWith('.json')) {
            const reader = new FileReader();
            reader.onload = () => {
                const parsed = JSON.parse(reader.result);
                setJsonData(parsed);
                setError('');
                router.push('/viewer');
            }
            reader.onerror = () => {
                setError('File was not parseable as json.');
                setJsonData(null);
            }

            reader.readAsText(file);
        } else {
            setError('File input should be json.');
            setFile(null);
        }
    }

    return (
        <>
            <input
                type="file"
                className="file-input file-input-primary"
                onChange={handleFileChange}></input>
            {
                file && (
                    <p className="text-gray-700">Selected file: {file.name}</p>
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

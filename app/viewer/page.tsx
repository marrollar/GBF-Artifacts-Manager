'use client'
import Image from "next/image"
import { useState } from "react"
import { useArtifactsJson } from "@/app/components/ArtifactsJsonContext"
import { Element, Artifacts } from "./types"
import { ActiveFilters } from "./filtering/filterConfig"

export default function ViewerHome() {
    const { jsonData } = useArtifactsJson();
    // const [elementFilter, setElementFilter] = useState(Element.NONE);
    const [filters, setFilters] = useState<ActiveFilters>({
        search: "",
        element: null,
        weapon: null
    });

    function updateFilter<K extends keyof ActiveFilters>(
        key: K,
        value: ActiveFilters[K]
    ) {
        console.log(key, value, filters[key])
        if (key === "element" || key === "weapon") {
            if (value === filters[key]) {
                setFilters(prev => ({ ...prev, [key]: null }))
            } else {
                setFilters(prev => ({ ...prev, [key]: value }))
            }
        } else {
            setFilters(prev => ({ ...prev, [key]: value }))
        }

    }

    if (!jsonData) {
        return <p className="text-red-500 mt-2">Loading...or json data not found.</p>
    }

    const artifacts: Artifacts = [];
    Object.entries(jsonData).forEach(([id, v]) => {
        const info = JSON.parse(v);

        artifacts[parseInt(id)] = {
            element: info.element,
            is_scrap: info.is_scrap,
            s1: {
                id: Math.floor(info.s1.skill_id / 10),
                name: info.s1.name,
                value: info.s1.effect_value,
                quality: info.s1.skill_quality
            },
            s2: {
                id: Math.floor(info.s2.skill_id / 10),
                name: info.s2.name,
                value: info.s2.effect_value,
                quality: info.s2.skill_quality
            },
            s3: {
                id: Math.floor(info.s3.skill_id / 10),
                name: info.s3.name,
                value: info.s3.effect_value,
                quality: info.s3.skill_quality
            },
            s4: {
                id: Math.floor(info.s4.skill_id / 10),
                name: info.s4.name,
                value: info.s4.effect_value,
                quality: info.s4.skill_quality
            },
        }
    })

    return (
        <div className="drawer lg:drawer-open">
            <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content justify-start">
                <div className="flex-none lg:hidden">
                    <label htmlFor="filter-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-6 w-6 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </label>
                </div>
                <div className="p-4">
                    {filters.element}
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="filter-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="bg-base-200 min-h-full w-80 p-4">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-center gap-2">
                            <button className={`btn p-0 hover:bg-neutral-500 ${filters.element===Element.FIRE?"bg-accent" :""}`} onClick={() => updateFilter("element", Element.FIRE)}>
                                <Image src="/Icon_Element_Fire.png" alt="Button" width={30} height={30} />
                            </button>
                            <button className={`btn p-0 hover:bg-neutral-500 ${filters.element===Element.WATER?"bg-accent" :""}`} onClick={() => updateFilter("element", Element.WATER)}>
                                <Image src="/Icon_Element_Water.png" alt="Button" width={30} height={30} />
                            </button>
                            <button className={`btn p-0 hover:bg-neutral-500 ${filters.element===Element.EARTH?"bg-accent" :""}`} onClick={() => updateFilter("element", Element.EARTH)}>
                                <Image src="/Icon_Element_Earth.png" alt="Button" width={30} height={30} />
                            </button>
                            <button className={`btn p-0 hover:bg-neutral-500 ${filters.element===Element.WIND?"bg-accent" :""}`} onClick={() => updateFilter("element", Element.WIND)}>
                                <Image src="/Icon_Element_Wind.png" alt="Button" width={30} height={30} />
                            </button>
                            <button className={`btn p-0 hover:bg-neutral-500 ${filters.element===Element.LIGHT?"bg-accent" :""}`} onClick={() => updateFilter("element", Element.LIGHT)}>
                                <Image src="/Icon_Element_Light.png" alt="Button" width={30} height={30} />
                            </button>
                            <button className={`btn p-0 hover:bg-neutral-500 ${filters.element===Element.DARK?"bg-accent" :""}`} onClick={() => updateFilter("element", Element.DARK)}>
                                <Image src="/Icon_Element_Dark.png" alt="Button" width={30} height={30} />
                            </button>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    )
}
'use client'
import { useArtifactsJson } from "@/app/components/ArtifactsJsonContext"
import Image from "next/image"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import ArtifactsList from "./components/ArtifactsList"
import { ActiveFilters } from "./filtering/filterConfig"
import type { Artifacts, Element, Weapon } from "./types"
import { elements, weapons } from "./types"

const __default_filter: ActiveFilters = {
    search: "",
    element: null,
    weapon: null

}

export default function ViewerHome() {
    const { jsonData } = useArtifactsJson();
    const [filters, setFilters] = useState<ActiveFilters>(__default_filter);
    const [showSidebar, setShowSidebar] = useState(false);

    function updateFilter<K extends keyof ActiveFilters>(
        key: K,
        value: ActiveFilters[K]
    ) {
        console.log(key, value, filters)
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

    const handleSearch = useDebouncedCallback((term) => {
        setFilters(prev => ({ ...prev, ["search"]: term }))
    }, 300) // TODO Consider if debouncing is necessary

    const toggleSideBar = () => {
        setShowSidebar(!showSidebar)
    }

    if (!jsonData) {
        return <p className="text-red-500 mt-2">Loading...or json data not found.</p>
    }

    const artifacts: Artifacts = {};
    Object.entries(jsonData).forEach(([id, v]) => {
        const info = JSON.parse(v);

        artifacts[id] = {
            element: info.element,
            weapon: info.weapon_group,
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
        // <div className="drawer lg:drawer-open">
        //     <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
        //     <div className="drawer-content justify-start">
        //         <div className="flex-none ">
        //             <label htmlFor="filter-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
        //                 <svg
        //                     xmlns="http://www.w3.org/2000/svg"
        //                     fill="none"
        //                     viewBox="0 0 24 24"
        //                     className="inline-block h-6 w-6 stroke-current"
        //                 >
        //                     <path
        //                         strokeLinecap="round"
        //                         strokeLinejoin="round"
        //                         strokeWidth="2"
        //                         d="M4 6h16M4 12h16M4 18h16"
        //                     ></path>
        //                 </svg>
        //             </label>
        //         </div>
        //         <div className="p-4">
        //             <ArtifactsList artifacts={artifacts} filterOpts={filters} />
        //         </div>
        //     </div>
        //     <div className="drawer-side">
        //         <label htmlFor="filter-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        //         <ul className="bg-base-200 min-h-full w-80 p-4">
        //             <div className="flex flex-col gap-4">
        //                 {/* Clear Filters button */}
        //                 <div className="flex items-center justify-center">
        //                     <button className="btn hover:bg-red-400" onClick={() => setFilters(__default_filter)}> Clear Filters </button>
        //                 </div>
        // 
        //                 {/* Search bar */}
        //                 <label className="input">
        //                     <input type="search" placeholder="Search" onChange={(e) => { handleSearch(e.target.value) }}></input>
        //                 </label>
        // 
        //                 {/* Elements filter */}
        //                 <div className="flex items-center justify-center gap-2">
        //                     {
        //                         Object.entries(elements).map(([key, value]) => (
        //                             <button key={key} className={`btn p-0 hover:bg-neutral-500 ${filters.element === value ? "bg-accent" : ""}`} onClick={() => updateFilter("element", value)}>
        //                                 <Image src={`/Icon_Element_${value}.png`} alt="Button" width={30} height={30} />
        //                             </button>
        //                         ))
        //                     }
        //                 </div>
        //                 {/* Weapons filter */}
        //                 <div className="flex flex-wrap items-center justify-center gap-2">
        //                     {
        //                         Object.entries(weapons).map(([key, value]) => (
        //                             <button key={key} className={`btn p-0 w-1/5 hover:bg-neutral-500 ${filters.weapon === value ? "bg-accent" : ""}`} onClick={() => updateFilter("weapon", value)}>
        //                                 <img className="w-full h-auto" src={`/Label_Weapon_${value}.png`} alt="Button" />
        //                             </button>
        //                         ))
        //                     }
        //                 </div>
        //             </div>
        //         </ul>
        //     </div>
        // </div>
        <div className="flex">
            <div className={`flex flex-col items-center gap-4 bg-base-300 h-screen p-4 ${showSidebar? "w-120":"w-10 overflow-hidden"}`}>
                {/* Clear Filters button */}
                <div className={`flex items-center justify-center ${!showSidebar? "hidden":""}`}>
                    <button className="btn hover:bg-red-400" onClick={() => setFilters(__default_filter)}> Clear Filters </button>
                </div>

                {/* Search bar */}
                <label className={`input ${!showSidebar? "hidden":""}`}>
                    <input type="search" placeholder="Search" onChange={(e) => { handleSearch(e.target.value) }}></input>
                </label>

                {/* Elements filter */}
                <div className={`flex items-center justify-center gap-2 ${!showSidebar? "hidden":""}`}>
                    {
                        Object.entries(elements).map(([key, value]) => (
                            <button key={key} className={`btn p-0 hover:bg-neutral-500 ${filters.element === value ? "bg-accent" : ""}`} onClick={() => updateFilter("element", value)}>
                                <img src={`/Icon_Element_${value}.png`} alt="Button"/>
                            </button>
                        ))
                    }
                </div>
                {/* Weapons filter */}
                <div className={`flex flex-wrap items-center justify-center gap-2 ${!showSidebar? "hidden":""}`}>
                    {
                        Object.entries(weapons).map(([key, value]) => (
                            <button key={key} className={`btn p-0 w-1/5 hover:bg-neutral-500 ${filters.weapon === value ? "bg-accent" : ""}`} onClick={() => updateFilter("weapon", value)}>
                                <img className="w-full h-auto" src={`/Label_Weapon_${value}.png`} alt="Button" />
                            </button>
                        ))
                    }
                </div>
            </div>
            <div className="flex flex-col h-screen w-full m-4">
                <button className="btn btn-square btn-ghost mb-4" onClick={toggleSideBar}>
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
                </button>
                <ArtifactsList artifacts={artifacts} filterOpts={filters} />
            </div>
        </div>
    )
}
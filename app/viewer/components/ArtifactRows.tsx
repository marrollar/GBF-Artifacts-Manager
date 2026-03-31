'use client'

import { useLayoutEffect, useRef, useState } from "react"

type Props = {
    name: string,
    value: string
}

type Position = {
    top: number,
    left: number
}

export function ArtifactSkillColumn({ name, value }: Props) {
    const [nameIsHovered, setNameIsHovered] = useState(false);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [pos, setPos] = useState<Position | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        setRect(e.currentTarget.getBoundingClientRect());
        setNameIsHovered(true);
    };

    useLayoutEffect(() => {
        if (!nameIsHovered || !rect || !tooltipRef.current) return;

        const tooltipRect = tooltipRef.current?.getBoundingClientRect();

        let top = rect.top - tooltipRect.height - 8;
        let left = rect.left;

        console.log(left, tooltipRect.width, window.innerWidth)

        // Clamp horizontally
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 8;
        }
        if (left < 8) {
            left = 8;
        }

        // Clamp vertically (flip if needed)
        if (top < 8) {
            top = rect.bottom + 28;
        }

        setPos({ top, left });
    }, [nameIsHovered, rect]);

    return (
        <div className={`flex flex-col flex-1 h-full rounded-md ${nameIsHovered ? "bg-gray-700" : ""}`}>
            <div className="flex h-1/2">
                <div className="flex overflow-clip px-[6px]" onMouseEnter={handleEnter} onMouseLeave={() => setNameIsHovered(false)} >
                    {name}
                </div>
            </div>
            <div className="flex h-1/2 text-yellow-300 overflow-clip items-center px-[6px]">
                {value}
            </div>
            {nameIsHovered && rect && (
                <div
                    ref={tooltipRef}
                    style={{
                    //     position: "fixed",
                        top: pos?.top,
                        left: pos?.left,
                    //     background: "#213452",
                    //     color: "white",
                    //     padding: "8px 12px",
                    //     borderRadius: "6px",
                    //     borderColor: "#ffffff",
                    //     borderStyle: "solid",

                    //     maxWidth: "250px",
                    //     whiteSpace: "normal",
                    //     wordBreak: "break-word",

                    //     zIndex: 1000,
                    //     pointerEvents: "none"
                    }}
                    className="
                        fixed
                        z-50
                        pointer-events-none
                        bg-[#213452]
                        px-[6px] py-[6px]
                        rounded-md
                        max-w-[250px]
                        whitespace-normal
                        wrap-break-word
                        
                    "
                >
                    <div>{name}</div>
                    <div style={{ color: "yellow" }}>{value}</div>
                </div>
            )}
        </div>
    )
}
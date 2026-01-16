
export function NameRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="row-span-2 line-clamp-2 overflow-scroll p-2 border-b border-b-amber-50/30 border-r border-r-amber-50/30">
            {children}
        </div>
    )
}

export function ValueRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="row-span-1 row-start-3 p-2 border-r border-r-amber-50/30">
            {children}
        </div>
    )
}
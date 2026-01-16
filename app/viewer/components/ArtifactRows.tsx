
export function NameRow({ last = false, children }: { last?: boolean, children: React.ReactNode }) {
    return (
        <div className={`h-full flex pl-2 pt-[10px] line-clamp-2 overflow-scroll ${last ? "" : "border-r"} border-amber-50/30 `}>
            {children}
        </div>
    )
}

export function ValueRow({ last = false, children }: { last?: boolean, children: React.ReactNode }) {
    return (
        <div className={`h-full flex pl-2 pb-2 items-center ${last ? "" : "border-r"} border-b border-amber-50/30 text-yellow-300`}>
            {children}
        </div>
    )
}
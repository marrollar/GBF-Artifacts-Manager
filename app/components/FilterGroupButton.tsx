import { MouseEventHandler } from "react"

type Props = {
    children: React.ReactNode
    className: string | undefined,
    onClick: MouseEventHandler<HTMLButtonElement> | undefined
}

export default function FilterGroupButton({ children, className, onClick }: Props) {
    return (
        <button className={`hover:bg-neutral-500 hover:cursor-pointer pl-2 pr-2 border rounded-md ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}
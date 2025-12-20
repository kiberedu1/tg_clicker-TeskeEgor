'use-client'
import React from "react"

export default function StyleComponentsRegistry({
    children,
}: {
    children: React.ReactNode
}) {
    if (typeof window !== 'undefined') return <>{children}</>
    return <>{children}</>
}
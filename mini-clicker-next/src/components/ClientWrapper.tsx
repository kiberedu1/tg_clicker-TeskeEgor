'use client'

import {ReactNode} from 'react'
import StyleComponentsRegistry from './StyledComponentsRegistry'
import GlobalStyles from '@/app/styles/GlobalStyles'

interface ClientWrapperProps {
    children: ReactNode
}

export default function ClientWrapper ({ children }: ClientWrapperProps){
        return(
            <StyleComponentsRegistry>
                <GlobalStyles/>
                {children}
            </StyleComponentsRegistry>
        )
}
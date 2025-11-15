"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
    isServer,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {ThemeProvider} from "next-themes";
import {getQueryClient} from "@/app/api/query";


import {usePathname, useSearchParams} from "next/navigation"
import {useEffect} from "react"
import {usePostHog} from 'posthog-js/react'

import posthog from 'posthog-js'
import {PostHogProvider as PHProvider} from 'posthog-js/react'


export default function Providers({children}: { children: React.ReactNode }) {
    // NOTE: Avoid useState when initializing the query client if you don't
    //       have a suspense boundary between this and the code that may
    //       suspend because React will throw away the client on the initial
    //       render if it suspends and there is no boundary
    const queryClient = getQueryClient()

    // useEffect(() => {
    //     posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    //         api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    //         person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    //         defaults: '2025-05-24'
    //     })
    // }, [])

    return (
        // <PHProvider client={posthog}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ThemeProvider>
        // </PHProvider>
    )
}
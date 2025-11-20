"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupLabel,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {NavUser} from "@/components/sidebarAuth";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useSession} from "@/lib/auth-client";
import posthog from "posthog-js";

const itemList = [
    {
        name: "Home",
        url: "/",
    },
    {
        name: "Explore",
        url: "/articles",
    },
    {
        name: "Quizzes",
        url: "/quizzes",
    },
    {
        name: "Tags",
        url: "/tags",
    },
];

export function AppSidebar(props: {
    // user:
    //   | {
    //       id: string;
    //       email: string;
    //       name: string;
    //       image?: string | null | undefined;
    //     }
    //   | false;
}) {
    // rsc
    //
    //client
    const {data: session, isPending} = useSession();

    return (
        <Sidebar variant={"sidebar"}>
            <SidebarHeader className={""}>Pulth App</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {itemList.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} onClick={
                                            () => {
                                                posthog.capture('sidebar_link_click', {url: item.url, name: item.name})
                                            }
                                        }>{item.name}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup/>
            </SidebarContent>
            <SidebarFooter>
                {session && session.user && (
                    <NavUser
                        email={session.user.email}
                        name={session.user.name}
                        id={session.user.id}
                        image={session.user.image || "/default.jpg"}
                    />
                )}
                {session == null && (
                    <Card className="gap-2 py-4 shadow-none">
                        <CardHeader className="px-4">
                            <CardTitle className="text-sm">
                                Subscribe to our newsletter
                            </CardTitle>
                            <CardDescription>
                                Opt-in to receive updates and news about the sidebar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4">
                            <form>
                                <div className="grid gap-2.5">
                                    <SidebarInput type="email" placeholder="Email"/>
                                    <Button
                                        className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
                                        size="sm"
                                    >
                                        Subscribe
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}

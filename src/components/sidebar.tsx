import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import {NavUser} from "@/components/sidebarAuth";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";


const itemList = [
    {
        name: "Explore",
        url: "/articles"
    }, {
        name: "Quizzes",
        url: "/quizzes"
    }, {
        name: "Tags",
        url: "/tags"
    }

]

export function AppSidebar() {

    return (
        <Sidebar>
            <SidebarHeader className={""}>
                hhaeeaderer
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {itemList.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            {item.name}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup/>
            </SidebarContent>
            <SidebarFooter>
                {/*{ <NavUser/> : <div>weekslatter</div>}*/}
                <NavUser/>

            </SidebarFooter>
        </Sidebar>
    )
}
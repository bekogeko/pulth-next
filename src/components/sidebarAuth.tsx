"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
    Settings,

} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {useSession, getSession, signOut} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import posthog from "posthog-js";

export function NavUser(props: { image: string, name: string, email: string, id: string }) {
    const {isMobile, setOpenMobile} = useSidebar();
    const router = useRouter();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={props.image || "/default.jpg"} alt={props.name}/>
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{props.name}</span>
                                    <span className="truncate text-xs">{props.email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4"/>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {/*<AvatarImage src={data?.user.image} alt={data?.user.name}/>*/}
                                        <AvatarImage src={props.image || "/default.jpg"} alt={props.name}/>
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{props.name}</span>
                                        <span className="truncate text-xs">{props.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Sparkles/>
                                    Upgrade to Pro
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <BadgeCheck/>
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    // close sidebar if mobile
                                    if (isMobile)
                                        setOpenMobile(false);
                                }}>
                                    <Settings/>
                                    <Link href={`/settings`} className="flex items-center w-full">
                                        Settings
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <Bell/>
                                    Notifications
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>


                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem>
                                    <LogOut/>
                                    Log out
                                </DropdownMenuItem>
                            </AlertDialogTrigger>


                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot will logout from your account. This will make us miss you a lot.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <form>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction type={"submit"} onClick={async () => {
                                    await signOut();
                                    posthog.reset();
                                    router.refresh();
                                }}>Log out</AlertDialogAction>
                            </form>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </SidebarMenuItem>
        </SidebarMenu>
    )
}

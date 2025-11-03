"use client"
import {signOut} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

function LogoutButton() {

    const router = useRouter();
    return <form method="POST">
        <Button variant={"outline"} type="submit" onClick={async () => {
            await signOut();
            router.push("/");
        }}>
            Logout
        </Button>
    </form>

}

export default LogoutButton;
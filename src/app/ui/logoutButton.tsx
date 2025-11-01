"use client";

import { useSession,signOut } from "@/lib/auth-client";

function LogoutButton() {

    const { data,isPending } = useSession();


    return <div>
        {
            data ? <form  method="POST">
                <button type="submit" disabled={isPending} onClick={async()=>{
                    signOut()
                }} className="border border-red-500 hover:border-red-700 p-2 rounded">Logout</button>
            </form> : <div>
                nope login
            </div>
        }


    </div>
}

export default LogoutButton;
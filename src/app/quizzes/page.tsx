import {auth} from "@/lib/auth";
import Link from "next/link";
import {headers} from "next/headers";

export default async function Quizzes() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return (
        <div>
            <h1 className={"text-5xl text-center"}>Quizzes</h1>
            {session ? (
                <p className={"mt-4 text-center"}>Welcome, {session.user.name}!</p>
            ):(<div>
                <p className={"mt-4 text-center"}>Please log in to access your quizzes.</p>
                <Link href={`/login`}>Login</Link>
            </div>)}
        </div>
    );
}
import Link from "next/link";
import { LoginForm } from "@/app/ui/loginForm";

export default function Login() {
    return (
        <div>
            <h1 className={"text-5xl text-center"}>Login</h1>
            <div className={"text-center my-4"}>
                <Link href={"/"}>Home Page</Link>
            </div>
            <LoginForm />
        </div>
    );
}
"use client"

import { signIn,signUp } from "@/lib/auth-client"
import {useState} from "react";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div className="bg-slate-600 rounded-lg mx-4 p-2">
            <div className="flex flex-col">
                <label htmlFor="email" >Email</label>
                <input type="email" name="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col">
                <label htmlFor="password" >Password</label>
                <input type="password" name="password" placeholder="Your password" required autoComplete="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            {/*Remember me */}
            <div className="flex flex-row">
                <input type="checkbox" name="rememberMe" />
                <label htmlFor="rememberMe" className="flex items-center gap-2" onChange={(e)=> setRememberMe(!rememberMe)}>
                    Remember me
                </label>
            </div>

            <button type={"submit"} className={"bg-indigo-500 p-2 rounded"} onClick={async ()=>{
                await signIn.email({
                    email: email,
                    password: password,
                    rememberMe: rememberMe,
                    callbackURL: "/"
                },{
                   onRequest: ()=> {
                       setLoading(true);
                   },
                   onResponse: ()=> {
                          setLoading(false);
                   }
               })
            }}>
                {loading ? (
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                    <p> Login </p>
                )}
            </button>


            {/*<form action={action} className={"bg-slate-400 flex flex-col gap-4 p-4 rounded max-w-md mx-auto"}>*/}
            {/*    <div className="flex flex-col w-full">*/}
            {/*        <label htmlFor="email">Email</label>*/}
            {/*        <input id="email" name="email" placeholder="Email" className={"bg-slate-500 rounded-md p-2 "}/>*/}
            {/*    </div>*/}
            {/*    {response?.errors?.email && <p className={"text-red-500"}>{response.errors.email}</p>}*/}

            {/*    <div className="flex flex-col w-full">*/}
            {/*        <label htmlFor="password">Password</label>*/}
            {/*        <input id="password" name="password" type="password" placeholder={"Password"}*/}
            {/*               className={"bg-slate-500 rounded-md p-2 "}/>*/}
            {/*    </div>*/}
            {/*    {response?.errors?.password && (*/}
            {/*        <div>*/}
            {/*            <p>Password must:</p>*/}
            {/*            <ul>*/}
            {/*                {response.errors.password.map((error) => (*/}
            {/*                    <li key={error}>- {error}</li>*/}
            {/*                ))}*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*    <button disabled={pending} type="submit"*/}
            {/*            className="rounded enabled:bg-blue-500 disabled:bg-blue-800 enabled:cursor-pointer">*/}
            {/*        Login*/}
            {/*    </button>*/}
            {/*/!*    no account? redirect to register cta*!/*/}
            {/*    <div>*/}
            {/*        <p>Don't have an account? <a href="/register" className="text-blue-700 underline">Register here</a></p>*/}
            {/*    </div>*/}
            {/*</form>*/}

            {/*<div>*/}
            {/*    {*/}
            {/*        response?.message && <p>{response.message}</p>*/}
            {/*    }*/}
            {/*</div>*/}
        </div>

    )
}


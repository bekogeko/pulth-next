"use client"

import {signUp} from "@/lib/auth-client";
import {useState} from "react";

export function RegisterForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPending, setIsPending] = useState(false);

    return (
        <div>

            <div className={"bg-slate-400 flex flex-col gap-4 p-4 rounded max-w-md mx-auto"}>
                <div className="flex flex-col w-full">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" placeholder="Name" className={"bg-slate-500 rounded-md p-2 "} onChange={(e) => setName(e.target.value)}/>
                </div>
                {/*{response?.errors?.name && <p>{response.errors.name}</p>}*/}

                <div className="flex flex-col w-full">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" placeholder="Email" className={"bg-slate-500 rounded-md p-2 "} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                {/*{response?.errors?.email && <p className={"text-red-500"}>{response.errors.email}</p>}*/}

                <div className="flex flex-col w-full">
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" placeholder={"Password"}
                           className={"bg-slate-500 rounded-md p-2 "} autoComplete={"new-password"} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <button disabled={isPending}
                        className="rounded enabled:bg-blue-500 disabled:bg-blue-800 enabled:cursor-pointer" onClick={(event)=>{
                    signUp.email({
                        name: name,
                        email: email,
                        password: password,
                        callbackURL: "/"
                    },{
                        onRequest: ()=> {
                            setIsPending(true);
                        },
                        onResponse: (ctx)=> {
                            setIsPending(false);
                            console.log(ctx.response);
                        }
                    })
                }} >
                    Register
                </button>
                {/*    have an account? redirect to login cta*/}
                <div>
                    <p>
                        Already have an account?
                        <a href="/login" className="text-blue-700 underline">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>

    )
}


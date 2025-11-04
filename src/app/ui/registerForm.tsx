"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {cn} from "@/lib/utils";
import {signUp} from "@/lib/auth-client";

import {toast} from "sonner";
import {useState} from "react";


import {useRouter} from "next/navigation";
import Link from "next/link";

export function RegisterForm() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    return (
        <form className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/*<form>*/}
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                autoComplete={"name"}
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                            ></Input>

                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                autoComplete={"email"}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            ></Input>
                        </Field>
                        <Field>
                            <Field className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        autoComplete="new-password"
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="confirm-password">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        aria-invalid={password !== confirmPassword}
                                        id="confirm-password"
                                        type="password"
                                        required
                                        autoComplete={"new-password"}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                        }}/>
                                </Field>
                            </Field>
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <Button disabled={isPending} onClick={async () => {
                                await signUp.email({
                                    name: name,
                                    email: email,
                                    password: password,
                                    role: "user",
                                    callbackURL: "/",
                                }, {
                                    onRequest: (ctx) => {
                                        setIsPending(true);
                                    },
                                    onResponse: (ctx) => {
                                        setIsPending(false);
                                    },
                                    onError: (ctx) => {
                                        // throw ctx;   sadas
                                        toast.error(ctx.error.message);
                                    },
                                    onSuccess: () => {
                                        router.push("/");
                                        toast.success("Account created successfully! Please check your email to verify your account.");
                                    }
                                })

                                // toast("Error creating account: ");
                            }}>Create Account</Button>
                            <FieldDescription className="text-center">
                                Already have an account? <Link href="/login">Sign in</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                    {/*</form>*/}
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </form>
    )
}


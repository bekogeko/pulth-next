"use client"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Field, FieldDescription, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {signIn} from "@/lib/auth-client";

import {toast} from "sonner";
import {useState} from "react";
import Link from "next/link";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    autoComplete={"email"}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete={"current-password"}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Field>
                            <Field>

                                {/*<Checkbox name={"remember-me"} autoCorrect={"remember-me"}/>*/}
                                {/*<Label htmlFor="rememberMe">*/}
                                {/*    Remember me*/}
                                {/*</Label>*/}
                                <div className="flex items-start gap-3">
                                    <Checkbox id="terms" defaultChecked/>
                                    <div className="grid gap-2">
                                        <Label htmlFor="terms-2">Remember me</Label>
                                    </div>
                                </div>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={loading} onClick={() => {
                                    signIn.email({
                                        email: email,
                                        password: password,
                                        rememberMe: rememberMe,
                                        callbackURL: "/"
                                    }, {
                                        onRequest: (ctx) => {
                                            setLoading(true);
                                        },
                                        onResponse: (ctx) => {
                                            setLoading(false);
                                        },
                                        onError: (ctx) => {
                                            toast.error(ctx.error.message);
                                        },
                                        onSuccess: (ctx) => {
                                            toast.success("Logged in successfully!");
                                        }
                                    })
                                }}>Login</Button>

                                <Button variant="outline" disabled={loading} type="button" onClick={() => {
                                    signIn.social({
                                        provider: "google",
                                        callbackURL: "/",
                                    }, {
                                        onRequest: (ctx) => {
                                            setLoading(true);
                                        },
                                        onResponse: (ctx) => {
                                            setLoading(false);
                                        },
                                    });
                                }}>
                                    Login with Google
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Link href={"/register"}>Sign up</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <Link href="/terms-of-service">Terms of Service</Link>{" "}
                and <a href="/privacy-policy">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}

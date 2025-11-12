import Link from "next/link";
// import { useSession } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogoutButton from "@/app/ui/logoutButton";
import { Button } from "@/components/ui/button";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Welcome to Pulth! Your Learning Hub",
    description: "Unlock Your Potential with Our Cutting-Edge Learning Website! Explore a World of Knowledge, from Expert Tutorials to Interactive Courses.",

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container max-w-screen-lg mx-auto px-4 sm:px-20">
      <h1 className="text-3xl font-bold mt-24">Hello, Welcome to Pulth!</h1>
      <p>You can solve quizzes, read articles and discuss the new topics</p>

      <div className="flex gap-2 items-center mt-4">
        <Link
          href="/quizzes"
          className="border-green-500 bg-gray-800 hover:bg-gray-600 transition-colorsa duration-100 p-2 rounded"
        >
          Quizzes
        </Link>
        <Link
          href="/articles"
          className="border-green-500 bg-gray-800 hover:bg-gray-600 transition-colorsa duration-100 p-2 rounded"
        >
          Explore
        </Link>
        {!session && (
          <>
            <Button asChild variant={"outline"}>
              <Link href="/register">Register</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        {session && (
          <>
            <span>Logged in as {session.user.email}</span>
            <LogoutButton />
          </>
        )}
      </div>
    </div>
  );
}

import {headers} from "next/headers"

import {auth} from "@/lib/auth";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getArticles} from "@/app/actions/article";
import ArticlesList from "@/app/articles/ArticleList";


export default async function Home() {
    const session = auth.api.getSession({
        headers: await headers()
    });

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['articles'],
        queryFn: () => getArticles()
    });

    return (
        <div className="container max-w-screen-lg mx-auto">
            <h1 className="text-3xl font-bold mt-24">Hello, Welcome to Pulth Articles!</h1>
            <p>You can solve quizzes, read articles and discuss the new topics</p>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <ArticlesList/>
            </HydrationBoundary>

        </div>
    );
}

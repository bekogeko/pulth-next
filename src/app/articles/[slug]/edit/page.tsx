import {getArticleBySlug, getAuthorBySlug} from "@/app/actions/article";
import {Metadata} from "next";
import ArticleEditor from "@/app/articles/[slug]/edit/ArticleEditor";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getQueryClient} from "@/app/api/query";


export async function generateMetadata(
    {
        params,
    }: {
        params: Promise<{ slug: string }>
    }
): Promise<Metadata> {
    const {slug} = await params;
    const articlePromise = getArticleBySlug(slug);
    const authorPromise = getAuthorBySlug(slug);

    const [article, author] = await Promise.all([articlePromise, authorPromise]);


    return {
        applicationName: "Pulth.com",
        title: article.title,
        description: article.description,
        keywords: article.keywords,
        authors: [
            // TODO link to author profile
            {name: author.name, url: "/user/" + author.id}
        ],
    }
}

export default async function ArticleSlugEditPage(
    {
        params,
    }: {
        params: Promise<{ slug: string }>
    }
) {
    const {slug} = await params;

    // get session user
    // prefetch article and author data for react-query
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (session === null) {
        throw new Error("Unauthorized");
    }
    //
    const queryClient = getQueryClient();

    const articleFetch = queryClient.fetchQuery({
        queryKey: ['articles', slug],
        queryFn: () => getArticleBySlug(slug)
    });

    const authorPrefetch = queryClient.prefetchQuery({
        queryKey: ["articles", "author", slug],
        queryFn: () => getAuthorBySlug(slug)
    })

    const [articleData, authorData] = await Promise.all([articleFetch, authorPrefetch]);

    if (articleData.authorId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    return <div>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ArticleEditor/>
        </HydrationBoundary>

    </div>;

}
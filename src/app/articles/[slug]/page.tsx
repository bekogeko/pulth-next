import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getArticleBySlug, getAuthorBySlug} from "@/app/actions/article";
import ArticleRenderer from "@/app/articles/[slug]/ArticleRenderer";
import {Metadata} from "next";

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

export default async function ArticleSlugPage(
    {
        params,
    }: {
        params: Promise<{ slug: string }>
    }
) {
    const {slug} = await params;

    const queryClient = new QueryClient();
    const articlePrefetch = queryClient.prefetchQuery({
        queryKey: ['articles', slug],
        queryFn: () => getArticleBySlug(slug)
    });

    const authorPrefetch = await queryClient.prefetchQuery({
        queryKey: ["articles", "author", slug],
        queryFn: () => getAuthorBySlug(slug)
    })

    await Promise.all([articlePrefetch, authorPrefetch]);

    return <div className="select-text dark:selection:text-indigo-500">
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ArticleRenderer/>
        </HydrationBoundary>
        <div>Comments:</div>
    </div>

}
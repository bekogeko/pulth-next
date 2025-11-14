import {dehydrate, HydrationBoundary, QueryClient, useQuery} from "@tanstack/react-query";
import {getArticleBySlug, getArticles, getAuthorBySlug, getTagsOnArticleBySlug} from "@/app/actions/article";
import ArticleRenderer from "@/app/articles/[slug]/ArticleRenderer";
import {Metadata} from "next";
import TagList from "@/app/articles/[slug]/TagList";
import ArticleNavigation from "@/app/articles/[slug]/ArticleNavigation";
import AuthorInfo from "@/app/articles/[slug]/AuthorInfo";
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

export async function generateStaticParams() {
    const allArticles = await getArticles();
    //allArticleRoutes

    return allArticles.map((article) => {
        return {slug: article.slug}
    })
}

export default async function ArticleSlugPage(
    {
        params,
    }: {
        params: Promise<{ slug: string }>
    }
) {
    const {slug} = await params;

    const queryClient = getQueryClient();
    const articlePrefetch = queryClient.prefetchQuery({
        queryKey: ['articles', slug],
        queryFn: () => getArticleBySlug(slug)
    });

    const authorPrefetch = queryClient.prefetchQuery({
        queryKey: ["articles", slug, "author"],
        queryFn: () => getAuthorBySlug(slug)
    })

    const tagsPrefetch = queryClient.prefetchQuery({
        queryKey: ["articles", slug, "tags"],
        queryFn: () => getTagsOnArticleBySlug(slug)
    })

    await Promise.all([articlePrefetch, authorPrefetch, tagsPrefetch]);


    return <div className="select-text dark:selection:text-indigo-500">
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ArticleRenderer/>

            {/* related articles / navigational links
                maybe after author info
            */}
            <ArticleNavigation slug={slug}/>
            <div className={"max-w-3xl mx-auto"}>
                <AuthorInfo slug={slug}/>
            </div>

            {/*    Votes  upvote, downvote*/}
            <TagList/>
            {/*0*/}
            {/*    Article Author image & name and visit btn*/}
        </HydrationBoundary>


        {/* %d Comments*/}
        <div className="container mx-auto max-w-3xl">Comments:</div>
    </div>

}
import {getArticlesByAuthorId, getAuthorInfo, getTagsByAuthorId} from "@/app/actions/author";
import {getQueryClient} from "@/app/api/query";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import AuthorInfo from "@/app/articles/[slug]/AuthorInfo";
import ArticlesList from "@/app/articles/ArticleList";
import prisma from "@/lib/prisma";
import {Metadata} from "next";
import TagList from "@/app/articles/[slug]/TagList";
import {Button} from "@/components/ui/button";
import Link from "next/link";

//generate metadata for user profile page
export async function generateMetadata(props: PageProps<"/users/[userId]">): Promise<Metadata> {
    const {userId} = await props.params;

    const userData = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            name: true,
            description: true,
        },
    })

    return {
        title: userData ? `${userData.name}'s Profile | Pulth` : 'User Profile | Pulth',
        description: userData?.description || `Profile page for user ${userId} on Pulth.`,
        keywords: `user, profile, ${userData?.name || ''}, pulth`,
        applicationName: "Pulth.com",
    }
}

export async function generateStaticParams() {
    const users = await prisma.user.findMany({
        where: {
            articles: {
                some: {
                    isPublished: true,
                }
            }
        },
        select: {
            id: true,
        },
    });

    return users.map((user) => ({
        userId: user.id,
    }));
}

export default async function UserIdPage(props: PageProps<"/users/[userId]">) {
    const {userId} = await props.params;

    const queryClient = getQueryClient();
    const articlesByAuthorPrefetch = queryClient.prefetchQuery({
        queryKey: ["articles", userId],
        queryFn: () => getArticlesByAuthorId(userId)
    });

    const authorFetch = queryClient.fetchQuery({
        // warning: maybe user?
        queryKey: ["author", userId],
        queryFn: () => getAuthorInfo(userId)
    });

    const tagsFetch = queryClient.fetchQuery({
        queryKey: ["tags", userId],
        queryFn: () => getTagsByAuthorId(userId)
    });

    const [authorData, tagsData] = await Promise.all([authorFetch, tagsFetch, articlesByAuthorPrefetch]);

    return <div>
        <HydrationBoundary state={dehydrate(queryClient)}>

            <AuthorInfo authorId={userId}/>
            <h1 className={"text-3xl my-4"}>
                Articles by{' '}
                {
                    authorData?.name
                }
            </h1>
            <p>
                Wrote on these tags:
                {
                    tagsData.map((topicEntry) => {
                        return <Button asChild variant={"link"} key={topicEntry.topicId + topicEntry.articleId}>
                            <Link href={`/tags/${topicEntry.topic.slug}`} className={"hover:bg-accent"}>
                                {topicEntry.topic.name}
                            </Link>
                        </Button>
                    })
                }
            </p>
            <ArticlesList byAuthorId={userId}/>
        </HydrationBoundary>
    </div>;
}
import {getArticlesByAuthorId} from "@/app/actions/author";
import {getQueryClient} from "@/app/api/query";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import AuthorInfo from "@/app/articles/[slug]/AuthorInfo";
import ArticlesList from "@/app/articles/ArticleList";
import prisma from "@/lib/prisma";

//generate metadata for user profile page
export async function generateMetadata(props: PageProps<"/users/[userId]">) {
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

    const authorPrefetch = queryClient.prefetchQuery({
        // warning: maybe user?
        queryKey: ["author", userId],
    });

    await Promise.all([authorPrefetch, articlesByAuthorPrefetch]);

    return <div>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AuthorInfo authorId={userId}/>
            {/*<AuthorArticleList authorId={userId}/>*/}
            <ArticlesList byAuthorId={userId}/>

        </HydrationBoundary>
    </div>;
}
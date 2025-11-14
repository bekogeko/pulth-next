"use client"
import {useQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {getTagsOnArticleBySlug} from "@/app/actions/article";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function TagList() {
    const slug = useParams<{ slug: string }>().slug;
    const {data, isLoading, isError} = useQuery({
        queryKey: ["articles", slug, "tags"],
        queryFn: () => getTagsOnArticleBySlug(slug),
    });
    return <div className="container mx-auto max-w-3xl">
        Tags:
        {data && data.map((topicEntry) => {
            return <Button asChild variant={"link"} key={topicEntry.topicId + topicEntry.articleId}>
                <Link href={`/tags/${topicEntry.topic.slug}`} className={"hover:bg-accent"}>
                    {topicEntry.topic.name}
                </Link>
            </Button>
        })}
    </div>
}
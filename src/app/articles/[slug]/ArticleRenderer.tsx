"use client";
import {useQuery} from "@tanstack/react-query";
import {useParams} from 'next/navigation'
import {getArticleBySlug} from "@/app/actions/article";

export default function ArticleRenderer() {

    const slug = useParams<{ slug: string }>().slug;

    const {data, isLoading, isError} = useQuery({
        queryKey: ['articles', slug],
        queryFn: () => getArticleBySlug(slug)
    });

    return <div>
        {isLoading && <p>Loading article...</p>}
        {isError && <p>Error loading article.</p>}
        {data && (
            <article className="prose lg:prose-xl max-w-none pt-16">
                <h1>{data.title}</h1>
                <p>{data.description}</p>
                {/*<div dangerouslySetInnerHTML={{__html: data.content}}/>*/}
            </article>
        )}
    </div>;
}
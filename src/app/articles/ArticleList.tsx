"use client";

import {useQuery} from "@tanstack/react-query";
import {getArticles} from "@/app/actions/article";
import Link from "next/link";

export default function ArticlesList() {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['articles'],
        queryFn: getArticles
    });

    return <div className="pt-16">
        {isLoading && <p>Loading articles...</p>}
        {isError && <p>Error loading articles.</p>}
        <div className={"grid md:grid-cols-2 grid-cols-1 gap-2"}>

            {data && data.map(article => (
                <div key={article.id} className="border p-4 mb-4 rounded">
                    {/*<Button variant={"link"} asChild={true}>*/}
                    <Link href={`/articles/${article.slug}`}>
                        <h2 className="text-xl font-bold mb-4 hover:underline line-clamp-1">{article.title}</h2>
                    </Link>
                    {/*</Button>*/}
                    <p className={"max-w-3/4 line-clamp-4"}>{article.description}</p>
                </div>
            ))}

        </div>
    </div>;
}
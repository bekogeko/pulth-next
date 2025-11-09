import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function TagPage(props: PageProps<'/tags'>) {

    const addedTopics = await prisma.tagsOnArticles.findMany({
        include: {
            topic: true
        },
    })

    // console.log("addedTopics", addedTopics);

    // key is slug

    const tagMap: Map<string, {
        tagName: string,
        tagSlug: string,
        articleName: string,
        articleSlug: string,
        articleDesc: string
    }[]> = new Map();

    const tagsMap = addedTopics.map(async (addedTopic) => {
        // const tagMap: Map<string, {
        //     tagName: string,
        //     tagSlug: string,
        //     articleName: string,
        //     articleSlug: string,
        //     articleDesc: string
        // }[]> = new Map();


        // get article
        const article = await prisma.article.findUnique({
            where: {
                id: addedTopic.articleId,
            }
        })
        if (!article) {
            throw new Error("No article found for this page");
        }

        if (tagMap.has(addedTopic.topic.slug)) {
            let prevData = tagMap.get(addedTopic.topic.slug)
            if (!prevData) {
                return new Error("key found but no prev data");
            }

            prevData.push({
                tagSlug: addedTopic.topic.slug,
                tagName: addedTopic.topic.name,
                articleSlug: article.slug,
                articleDesc: article.description,
                articleName: article.title
            });

            // console.log("tagMap", tagMap);
            // todo use id
            tagMap.set(addedTopic.topic.slug,
                prevData
            )

        } else {
            tagMap.set(addedTopic.topic.slug, [{
                tagSlug: addedTopic.topic.slug,
                tagName: addedTopic.topic.name,
                articleSlug: article.slug,
                articleDesc: article.description,
                articleName: article.title
            }]);
        }
        // console.log("tagMap", tagMap);
    })

    await Promise.all(tagsMap);
    console.log(tagMap);

    return <div className="container max-w-screen-lg mx-auto">

        {/*{*/}
        {/*    JSON.stringify(tagsMap, null, 4)*/}
        {/*}*/}
        {
            tagMap.values().toArray().map((a) => {
                return <div>
                    {/*{JSON.stringify(a)}*/}
                    <h2 className={"text-2xl "}><Link href={`/tags/${a[0].tagSlug}`}>Tag "{a[0].tagName}"</Link></h2>
                    {a.map(tag => (<div>
                        {/*{tag.articleName}*/}

                        <div key={tag.tagSlug + tag.articleSlug} className="border p-4 mb-4 rounded">
                            {/*<Button variant={"link"} asChild={true}>*/}
                            <Link href={`/articles/${tag.articleSlug}`}>
                                <h2 className="text-xl font-bold mb-4 hover:underline line-clamp-1">{tag.articleName}</h2>
                            </Link>
                            {/*</Button>*/}
                            <p className={"max-w-3/4 line-clamp-4"}>{tag.articleDesc}</p>
                        </div>

                    </div>))}
                </div>;
            })
        }

        {/*<h1 className={"dark text-3xl my-16"}> "{topic.name}" tagged articles:</h1>*/}
        {/*<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">*/}
        {/*    {taggedArticles.map((taggedArticle) =>*/}
        {/*        (<div key={taggedArticle.article.id} className="border p-4 mb-4 rounded">*/}
        {/*            /!*<Button variant={"link"} asChild={true}>*!/*/}
        {/*            <Link href={`/articles/${taggedArticle.article.slug}`}>*/}
        {/*                <h2 className="text-xl font-bold mb-4 hover:underline line-clamp-1">{taggedArticle.article.title}</h2>*/}
        {/*            </Link>*/}
        {/*            /!*</Button>*!/*/}
        {/*            <p className={"max-w-3/4 line-clamp-4"}>{taggedArticle.article.description}</p>*/}
        {/*        </div>)*/}
        {/*    )}*/}
        {/*</div>*/}
    </div>
}
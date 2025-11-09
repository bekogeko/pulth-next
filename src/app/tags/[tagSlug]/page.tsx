import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function TagPage(props: PageProps<'/tags/[tagSlug]'>) {
    const {tagSlug} = await props.params;

    const topic = await prisma.topic.findUnique({
        where: {
            slug: tagSlug
        }
    })

    if (!topic)
        throw new Error("No topic specified");

    const taggedArticles = await prisma.tagsOnArticles.findMany({
        where: {
            topic: {
                slug: tagSlug
            }
        },
        include: {
            article: true
        },
    })

    return <div className="container max-w-screen-lg mx-auto">
        <h1 className={"dark text-3xl my-16"}> "{topic.name}" tagged articles:</h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {taggedArticles.map((taggedArticle) =>
                (<div key={taggedArticle.article.id} className="border p-4 mb-4 rounded">
                    {/*<Button variant={"link"} asChild={true}>*/}
                    <Link href={`/articles/${taggedArticle.article.slug}`}>
                        <h2 className="text-xl font-bold mb-4 hover:underline line-clamp-1">{taggedArticle.article.title}</h2>
                    </Link>
                    {/*</Button>*/}
                    <p className={"max-w-3/4 line-clamp-4"}>{taggedArticle.article.description}</p>
                </div>)
            )}
        </div>
    </div>
}
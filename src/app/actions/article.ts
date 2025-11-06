"use server";

// get articles
import prisma from "@/lib/prisma";
import {BlockWithFallback, BlockWithFallbackSchema} from "@/schemas/EditorTypes";
import {InputJsonValue} from "@/generated/prisma-client/runtime/library";

export async function getArticles() {
    // Placeholder for fetching articles from a database or API
    return prisma.article.findMany({where: {isPublished: true}});
}

export async function getArticleBySlug(slug: string) {
    const article = await prisma.article.findUnique({where: {slug: slug}});

    if (!article) {
        throw new Error("Article not found");
    }
    return article;
}


export async function getAuthorBySlug(slug: string) {
    // bad request example

    const author = await prisma.article.findUnique({where: {slug: slug}}).author();

    if (!author) {
        throw new Error("Author not found");
    }

    return author;
}


export async function publishArticle(slug: string, body: BlockWithFallback[]) {
    // Warning: Security problem?
    const parsedBody = BlockWithFallbackSchema.array().parse(body);

    const article = await prisma.article.findUnique({where: {slug: slug}});

    if (!article) {
        throw new Error("Article not found");
    }

    const updateRes = await prisma.article.update({
        data: {
            bodyData: parsedBody as unknown as InputJsonValue[],
            draftBodyData: article.bodyData as unknown as InputJsonValue[]
        },
        where: {
            slug: slug
        }
    })

    return updateRes;
}
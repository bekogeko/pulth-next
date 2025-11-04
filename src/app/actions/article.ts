"use server";

// get articles
import prisma from "@/lib/prisma";

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
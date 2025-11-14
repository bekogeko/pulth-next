"use server"

import prisma from "@/lib/prisma";

export async function getArticlesByAuthorId(authorId: string) {
    return prisma.article.findMany({
        where: {
            authorId: authorId,
        }
    })
}

export async function getAuthorInfo(authorId: string) {
    return prisma.user.findUnique({
        where: {
            id: authorId,
        },
        // omit: {
        //     emailVerified: true
        // }
    })

}

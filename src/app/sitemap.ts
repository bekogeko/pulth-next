import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.pulth.com";

  // Fetch all published articles
  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Fetch all topics/tags
  const topics = await prisma.topic.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Generate article URLs
  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Generate tag URLs
  const tagUrls: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${baseUrl}/tags/${topic.slug}`,
    lastModified: topic.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [...staticRoutes, ...articleUrls, ...tagUrls];
}

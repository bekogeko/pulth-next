"use client";
import {useQuery} from "@tanstack/react-query";
import {useParams} from 'next/navigation'
import {getArticleBySlug, getArticles} from "@/app/actions/article";
import {ReactNode} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Block} from "@/schemas/EditorTypes";
import ListRenderer from "@/app/articles/[slug]/ListRenderer";

//
// type BlockType = {
//     id: string;
//     type: "paragraph";
//     data: {
//         text: string;
//     };
// } | {
//     id: string;
//     type: "header";
//     data: {
//         text: string;
//         level: number;
//     }
// } | {
//     id: string;
//     type: "list";
//     data: {
//         items: string[];
//         style: "ordered" | "unordered";
//     }
// };

function Header(props: { level: number; children: ReactNode }) {
  switch (props.level) {
    case 1:
      return <h1>{props.children}</h1>;
    case 2:
      return <h2>{props.children}</h2>;
    case 3:
      return <h3>{props.children}</h3>;
    case 4:
      return <h4>{props.children}</h4>;
    case 5:
      return <h5>{props.children}</h5>;
    case 6:
      return <h6>{props.children}</h6>;
    default:
      return <div>{props.children}</div>;
  }
}

export default function ArticleRenderer() {
  const slug = useParams<{ slug: string }>().slug;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles", slug],
    queryFn: () => getArticleBySlug(slug),
  });

  // get next and previous articles
  const { data: articlesData } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  });

  // find index of current article
  const currentIndex = articlesData
    ? articlesData.findIndex((article) => article.slug === slug)
    : -1;

  // get previous article
  const previousArticle =
    articlesData && currentIndex > 0 ? articlesData[currentIndex - 1] : null;

  // get next article
  const nextArticle =
    articlesData && currentIndex < articlesData.length - 1
      ? articlesData[currentIndex + 1]
      : null;

  return (
    <div className="container mx-auto">
      {isLoading && <p>Loading article...</p>}
      {isError && <p>Error loading article.</p>}
      {data && (
        <article className="prose-slate dark:prose-invert prose lg:prose-lg max-w-none pt-24">
          <h1 className="text-center">{data.title}</h1>
          {/*<p>{data.description}</p>*/}
          {(data.bodyData as Block[]).map((item) => {
            switch (item.type) {
              case "header":
                return (
                  <Header key={item.id} level={item.data.level}>
                    {item.data.text}
                  </Header>
                );
              case "paragraph":
                return <p key={item.id}>{item.data.text}</p>;
              case "list":
                return (
                  <ListRenderer
                    key={item.id}
                    style={item.data.style}
                    items={item.data.items}
                    meta={item.data.meta}
                  />
                );
              default:
                return (
                  <pre className={"bg-red-400 "}>
                    Error unknown type: {JSON.stringify(item)}
                    {JSON.stringify(item)}
                  </pre>
                );
            }
          })}
        </article>
      )}

      <div className="flex justify-between mt-8 pb-16">
        {previousArticle ? (
          <Button asChild variant={"link"}>
            <Link
              href={`/articles/${previousArticle.slug}`}
              className="text-blue-600 hover:underline"
            >
              &larr; {previousArticle.title}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {nextArticle ? (
          <Button asChild variant={"link"}>
            <Link
              href={`/articles/${nextArticle.slug}`}
              className="text-blue-600 hover:underline"
            >
              {nextArticle.title} &rarr;
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

"use client";

import {useEffect, useEffectEvent, useRef} from "react";
import EditorJS, {OutputBlockData} from "@editorjs/editorjs";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {getArticleBySlug, publishArticle} from "@/app/actions/article";
import {Button} from "@/components/ui/button";
import {BlockWithFallback} from "@/schemas/EditorTypes";
import {Toast} from "next/dist/next-devtools/dev-overlay/components/toast";
import {toast} from "sonner";

export default function ArticleEditor() {
    const elementRef = useRef(null);
    const editorRef = useRef<EditorJS>(null);

    // get slug
    const {slug} = useParams<{ slug: string }>();


    const onEditorReady = useEffectEvent(() => {
        console.log("Editor.js is ready to work!");
    });

    const onEditorChange = useEffectEvent(() => {
        console.log("Editor.js content changed!");
    });

    const {data, isLoading, isError} = useQuery({
        queryKey: ['articles', slug],
        queryFn: () => getArticleBySlug(slug)
    });

    const publishMutation = useMutation({
        mutationKey: ["articles"], // rahat kal king
        mutationFn: async (data: { slug: string, body: BlockWithFallback[] }) => publishArticle(data.slug, data.body),
        onSuccess: (res) => {
            toast.success(res.title);
        }
    });


    useEffect(() => {
        const editorPromise = import("@editorjs/editorjs").then(({default: EditorJS}) => {
            if (elementRef.current) {
                editorRef.current = new EditorJS({
                    holder: elementRef.current,
                    autofocus: true,
                    onReady: onEditorReady,
                    onChange: onEditorChange,
                    data: {
                        blocks: data ? data.bodyData as unknown as OutputBlockData<string, any>[] : []
                    },
                    tools: {
                        header: {
                            class: require("@editorjs/header"),
                            inlineToolbar: ["link"],
                            config: {
                                placeholder: "Header",
                            },
                        },
                        list: {
                            class: require("@editorjs/list"),
                            inlineToolbar: true,
                            shortcut: "CMD+SHIFT+L",
                        },
                    }
                });
            }
        })
        return () => {
            editorRef.current?.destroy();
        };
    }, [])


    return <div className={"prose-base dark:prose-invert select-text dark:selection:text-indigo-500   "}>
        <div className="flex justify-end mb-3">
            <Button
                variant={"outline"}
                onClick={async () => {
                    publishMutation.mutate({
                        slug,
                        body: (await editorRef.current?.save() ?? {}).blocks as unknown as BlockWithFallback[]
                    })
                }}
            >
                Publish Changes
            </Button>
        </div>
        <h1 className={"text-center mt-16"}>{!isLoading && data && data.title}</h1>
        <div id={"editorjs"} ref={elementRef} data-enable-grammarly="true"></div>

    </div>;
}

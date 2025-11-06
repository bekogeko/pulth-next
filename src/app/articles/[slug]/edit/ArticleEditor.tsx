"use client";

import {useEffect, useEffectEvent, useRef} from "react";
import EditorJS, {OutputBlockData} from "@editorjs/editorjs";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {getArticleBySlug} from "@/app/actions/article";

export default function ArticleEditor() {
    const elementRef = useRef(null);
    const editorRef = useRef<EditorJS>(null);

    // get slug
    const {slug} = useParams<{ slug: string }>();


    // const editor = new EditorJS({
    //     holder: "editorjs",
    //     autofocus: true,
    //     onReady: () => {
    //         console.log("Editor.js is ready to work!");
    //     },
    //     onChange: async () => {
    //         console.log("Now I know that Editor's content changed!");
    //     }
    // });

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


    return <div className={""}>
        <div id={"editorjs"} ref={elementRef} data-enable-grammarly="true"></div>
    </div>;
}

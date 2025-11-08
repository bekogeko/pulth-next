import * as z from 'zod';

type BlockU =
    | { id: string; type: "paragraph"; data: { text: string } }
    | { id: string; type: "header"; data: { text: string; level: number } }
    | { id: string; type: "list"; data: { items: string[]; style: "ordered" | "unordered" } };


const ParagraphBlock = z.object({
    id: z.string(),
    type: z.literal("paragraph"),
    data: z.object({
        text: z.string(),
    }),
});

const HeaderBlock = z.object({
    id: z.string(),
    type: z.literal("header"),
    data: z.object({
        text: z.string(),
        level: z.number(),
    }),
});

const orderedMeta = z.object({
    start: z.number(),
    counterType: z.enum(["numeric", "lower-roman", "upper-roman", "lower-alpha", "upper-alpha"])
})
const checklistMeta = z.object({checked: z.boolean()});


type ItemMeta = z.infer<typeof checklistMeta> | z.infer<typeof orderedMeta>;

export type ListItemType = {
    content: string;
    meta: ItemMeta | {};
    items?: ListItemType[];
};

let item: z.ZodType<ListItemType>;

item = z.lazy(() =>
    z.object({
        content: z.string(),
        meta: z.union([checklistMeta, orderedMeta]).optional(),
        items: z.array(item).optional(),
    }) as z.ZodType<ListItemType>
);


const ListBlock = z.object({
    id: z.string(),
    type: z.literal("list"),
    data: z.object({
        items: z.array(item),
        style: z.union([z.literal("ordered"), z.literal("unordered"), z.literal("checklist")]),
        meta: z.union([orderedMeta, checklistMeta]),

    }),
});

export const BlockSchema = z.discriminatedUnion("type", [
    ParagraphBlock,
    HeaderBlock,
    ListBlock,
]);

export type Block = z.infer<typeof BlockSchema>;

const FallbackBlock = z.object({
    id: z.string(),
    type: z.string(),      // any string not matched above
    data: z.unknown(),
});

export const BlockWithFallbackSchema = z.union([BlockSchema, FallbackBlock]);
export type BlockWithFallback = z.infer<typeof BlockWithFallbackSchema>;
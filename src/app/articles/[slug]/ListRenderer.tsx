import {ListItemType} from "@/schemas/EditorTypes"
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;
import InlineRenderer from "@/app/articles/[slug]/InlineRenderer";

function ListItem(props: IntrinsicAttributes & { item: ListItemType, style: "ordered" | "unordered" | "checklist" }) {
    return <li className={" [counter-increment: item] before:content-[counter(item)'. ']"}>
        {
            "checked" in props.item.meta && <input checked={props.item.meta.checked} type="checkbox" readOnly/>
        }

        <InlineRenderer text={props.item.content}/>


        {
            // there is a list under this item
            props.item.items && <ListRenderer items={props.item.items} style={"ordered"} meta={props.item.meta}/>
        }
    </li>;
}

export default function ListRenderer(props: {
    items: ListItemType[],
    style: "ordered" | "unordered" | "checklist",
    meta: {
        checked: boolean
    } | {
        start: number
        counterType: "numeric" | "lower-roman" | "upper-roman" | "lower-alpha" | "upper-alpha"
    } | {}
}) {
    switch (props.style) {
        case "ordered":
            return <ol className={""}
                       type={
                           "counterType" in props.meta ? (
                               props.meta.counterType == "upper-roman" ? "I" :
                                   props.meta.counterType == "lower-roman" ? "i" :
                                       props.meta.counterType == "upper-alpha" ? "A" :
                                           props.meta.counterType == "lower-alpha" ? "a" : "1"
                           ) : "1"
                       }
            >
                {props.items.map((listItem, index) => {
                    return <ListItem item={listItem} key={index} style={"ordered"}/>
                })}
            </ol>;
        case "unordered":
            return <ul>
                {props.items.map((item, index) => {
                    return <ListItem item={item} key={index} style={"unordered"}/>
                })}
            </ul>
        case "checklist":
            return <ul>{props.items.map((item, index) => {
                return <ListItem item={item} key={index} style={"checklist"}/>
            })}</ul>;

    }
}
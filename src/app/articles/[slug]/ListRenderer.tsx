import {ListItemType} from "@/schemas/EditorTypes"

function ListItem() {
    return <li>
        hi
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
    // return <pre className={"bg-red-400"}>{props.style}</pre>
    console.log(props)
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
                {props.items.map((item, index) => {
                    return <li key={index}>
                        {item.content}

                        {
                            item.items && <ListRenderer items={item.items} style={"ordered"} meta={item.meta}/>
                        }
                    </li>
                })}
            </ol>;
        case "unordered":
            return <ul>
                {props.items.map((item, index) => {
                    return <li key={index}>
                        {item.content}

                        {
                            item.items && <ListRenderer items={item.items} style={"unordered"} meta={item.meta}/>
                        }
                    </li>
                })}
            </ul>
        case "checklist":
            return <ul>{props.items.map((item, index) => {
                return <li key={index}>
                    <input type="checkbox" checked={item.meta.checked!} readOnly={true}/>
                    {item.content}
                    {
                        item.items && <ListRenderer items={item.items} style={"checklist"} meta={item.meta}/>
                    }
                </li>
            })}</ul>;

    }
}
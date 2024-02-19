import "./ListElement.css"
import {FC} from "react";

interface ListElementPropI {
    name: string;
    subtext: string | undefined;
    selected: boolean;
    setSelected: () => void;
    onRemoveClick?: () => void;
}

const ListElement : FC<ListElementPropI> = ({name, subtext, selected, setSelected, onRemoveClick}) => {
    const finalName = name === "" ? "No title" : name;
    const content = <span>{finalName} {subtext === undefined ? null : <div>{subtext}</div>}</span>;
    const rmBtn = <button onClick={onRemoveClick}>🗑️</button>;

    return(
        <li className={"listElement " + (selected ? " selected" : "")}
                onClick={setSelected}>
            {content}
            {selected && onRemoveClick !== undefined ? rmBtn : null}
        </li>
    );
}

export default ListElement;
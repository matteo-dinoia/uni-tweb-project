import "./ListElement.css"
import {FC} from "react";

interface ListElementPropI {
    name : string;
    selected : boolean;
    setSelected : () => void;
    onRemoveClick? : () => void;
}

const ListElement : FC<ListElementPropI> = ({name, selected, setSelected, onRemoveClick}) => {
    let result : JSX.Element;

    if(selected) {
        result = (
            <li className={"listElement selected"}>
                <span>{name}</span>
                {onRemoveClick !== undefined ? <button onClick={onRemoveClick}>🗑️</button> : ""}
            </li>
        );

    }else{
        result = (
            <li className={"listElement"} onClick={setSelected}>
                <span>{name}</span>
            </li>
        );
    }

    return result;
}

export default ListElement;
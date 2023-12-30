import "./ListElement.css"
import {FC} from "react";

interface ListElementPropI {
    name : string;
    selected : boolean;
    onClick : () => void;
    onButtonRemoveClick : () => void;
    onButtonEditClick : () => void;
}

const ListElement : FC<ListElementPropI> = ({name, selected, onClick, onButtonRemoveClick, onButtonEditClick}) => {
    const buttons = <>
        <button onClick={() => onButtonRemoveClick()}>Remove</button>
        <button onClick={() => onButtonEditClick()}>...</button>
    </>;

    let result : JSX.Element;

    if(!selected) {
        result = (
            <li className={"listElement"} onClick={onClick}>
                <span>{name}</span>
            </li>
        );
    }else{
        result = (
            <li className={"listElement selected"}>
                <span>{name}</span>
                {buttons}
            </li>
        );
    }

    return result;
}

export default ListElement;
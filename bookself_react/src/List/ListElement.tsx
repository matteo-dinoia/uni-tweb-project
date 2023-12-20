import "./ListElement.css"
import {FC} from "react";

interface ListElementPropI {
    name : string;
    selected : boolean;
    onClick : () => void;
}

const ListElement : FC<ListElementPropI> = ({name, selected, onClick}) => {
    const buttons = <><button>Remove</button><button>...</button></>;

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
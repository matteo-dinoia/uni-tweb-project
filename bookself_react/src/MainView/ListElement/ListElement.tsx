import "./ListElement.css"
import {FC} from "react";

interface ListElementPropI {
    name : string;
    selected : boolean;
}

const ListElement : FC<ListElementPropI> = ({name, selected}) => {
    const buttons = <><button>Remove</button><button>...</button></>;

    let result : JSX.Element;

    if(!selected) {
        result = (
            <li className={"listElement"}>
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
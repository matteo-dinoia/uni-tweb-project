import {FC, useState} from "react";
import ListElement from "./ListElement.tsx";

interface ListPropI{
    array : string[];
}

const List: FC<ListPropI> = ({array}) => {
    const [selected, setSelected] = useState(-1);

    return (
        <ul>
            {array.map((value, index) => (<ListElement name={value}
                    selected={index === selected} onClick={() => setSelected(index)}/>))}
        </ul>
    );
}

export default List;
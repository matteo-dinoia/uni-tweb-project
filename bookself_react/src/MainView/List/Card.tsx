import {FC, useState} from "react";
import ListElement from "./ListElement.tsx";
import "./Card.css"

interface CardPropI{
    title : string;
    className : string;
    array : string[];
    changeSelection : (index : number) => void;
}

const Card: FC<CardPropI> = ({title, className, array, changeSelection}) => {
    const [selected, setSelected] = useState(-1);

    return (
        <div className={"card " + className}>

            <div className={"titleCard"}>
                <h2>{title}</h2>
                <button>Add</button>
            </div>

            <ul>
                {array.map((value, index) => (<ListElement name={value}
                                                           selected={index === selected} onClick={() => {
                    setSelected(index);
                    changeSelection(index)
                }}/>))}
            </ul>
        </div>

    )
        ;
}

export default Card;
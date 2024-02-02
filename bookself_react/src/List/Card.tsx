import {FC} from "react";
import ListElement from "./ListElement.tsx";
import "./Card.css";
import {ViewableElement} from "../util/interfaces.ts";

interface CardPropI{
    title : string;
    className : string;
    array : ViewableElement[];
    selected : number;
    setSelected : (index : number) => void;
    topBtnName : string;
    onTopBtnClick : () => void;
    hasRemove? : (index : number) => boolean;
    onRemoveClick? : (index : number) => void;
}

const Card: FC<CardPropI> = ({title, className, array, selected, setSelected,
                                 topBtnName, onTopBtnClick, hasRemove, onRemoveClick}) => {

    const remFunction = (index : number) =>
        hasRemove !== undefined && onRemoveClick !== undefined && hasRemove(index)
        ? (() => onRemoveClick(index))
        : undefined;

    return (
        <div className={className}>

            <div className={"titleCard"}>
                <h2>{title}</h2>
                <button onClick={onTopBtnClick}>{topBtnName}</button>
            </div>

            <ul>
                {array.map((value, index) => (
                    <ListElement key={value.key} name={value.name} selected={index === selected}
                            setSelected={() => {setSelected(index)}}
                            onRemoveClick={remFunction(index)}/>
                ))}
            </ul>

        </div>
    );
}

export default Card;
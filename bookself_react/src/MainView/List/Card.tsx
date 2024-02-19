import {FC} from "react";
import ListElement from "./ListElement.tsx";
import {ViewableElement} from "../../util/interfaces.ts";
import BtnTitle from "../smallComponent/BtnTitle.tsx";
import "./Card.css"

interface CardPropI{
    title : string;
    className : string;
    array : ViewableElement[];
    selected : number;
    setSelected : (index : number) => void;
    topBtnName? : string;
    onTopBtnClick : (() => void);
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
            <BtnTitle title={title} topBtnName={topBtnName} onTopBtnClick={onTopBtnClick}/>

            <ul>
                {array.map((value, index) => (
                    <ListElement key={value.key} name={value.name}  subtext={value.subtext}
                        selected={index === selected}
                        setSelected={() => {setSelected(index)}}
                        onRemoveClick={remFunction(index)}/>
                ))}
            </ul>

        </div>
    );
}

export default Card;
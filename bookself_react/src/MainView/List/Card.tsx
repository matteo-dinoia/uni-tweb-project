import {FC, useState} from "react";
import ListElement from "./ListElement.tsx";
import "./Card.css"
import GlassPane from "../GlassPane/GlassPane.tsx";
import {InputAction, InputElement} from "../../util/enums.ts";
import {ViewableElement} from "../../util/interfaces.ts";

interface CardPropI{
    title : string;
    className : string;
    array : ViewableElement[];
    selected : number;
    setSelected : (index : number) => void;
    buttonEnabled : boolean;
    inputElement : InputElement
}

const Card: FC<CardPropI> = ({title, className, array,
                                selected, setSelected, buttonEnabled,
                                inputElement}) => {
    const [showGlasspane, setShowGlasspane] = useState(InputAction.noAction);

    return (
        <div className={"card " + className}>

            <div className={"titleCard"}>
                <h2>{title}</h2>
                {buttonEnabled ? <button onClick={() => setShowGlasspane(InputAction.newItem)}>Add</button> : ""}
            </div>

            <ul>
                {array.map((value, index) => (
                    <ListElement name={value.name} key={value.key} selected={index === selected}
                            onClick={() => {setSelected(index)}}
                            onButtonRemoveClick={()=>{setShowGlasspane(InputAction.deleteItem)}}
                            onButtonEditClick={()=>{setShowGlasspane(InputAction.editItem)}}/>
                ))}
            </ul>
            {showGlasspane !== InputAction.noAction ? <GlassPane inputAction={showGlasspane} inputElement={inputElement} closeHandler={() => setShowGlasspane(InputAction.noAction)}/> : ""}
        </div>

    )
        ;
}

export default Card;
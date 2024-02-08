import "./Glasspane.css"
import {FC, useEffect, useState} from "react";
import Card from "../../List/Card.tsx";
import {ViewableElement} from "../../util/interfaces.ts";
import {serverGetList} from "../../util/serverFetch.ts";
import {BasicGlasspanePropI, closeOnClickOutside} from "./GlasspaneUtils.ts";

function getUsersFromServer(ofBook : string, setSimilars:  (friends : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        const array: ViewableElement[] = data.map((element, index) => ({name: "" + element["similar"], key: index, sqlData: element}))
        return array;
    };

    return serverGetList("similars?book=" + ofBook + "&inverse=yes",  arrayMan, setSimilars);
}

interface SimilarGlasspanePropI extends  BasicGlasspanePropI{
    ofBook : string;
}

const GlasspaneSimilars : FC<SimilarGlasspanePropI> = ({closeHandler, confirmHandler, ofBook}) => {
    const [selected, setSelected] = useState<number>(-1);
    const [similars, setSimilars] = useState<ViewableElement[]>([]);
    useEffect(() => getUsersFromServer(ofBook, setSimilars), [ofBook]);


    return (
        <div className={"glassPane"} onClick={(e) => closeOnClickOutside(closeHandler, e)}>
            <Card title={"Add similar"} className={"card  wrapper-card"} array={similars}
                  selected={selected} setSelected={setSelected}
                  topBtnName={"Confirm Selection"} onTopBtnClick={() => confirmHandler(similars[selected])}/>
        </div>
    );
}

export default GlasspaneSimilars;
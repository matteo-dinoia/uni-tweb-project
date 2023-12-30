import {FC, useState} from "react";
import Card from "./List/Card.tsx";
import {InputElement} from "../util/enums.ts";
import {ViewableElement} from "../util/interfaces.ts";

interface RightViewPropI{
    ofBook : string | undefined;
}

function getSimilars(ofBook: string | undefined) : ViewableElement[] {
    if(ofBook === undefined) return [];
    return [
        {name: ofBook + " -> Similar Book 1", key: 1},
        {name: ofBook + " -> Similar Book 2", key: 2},
        {name: ofBook + " -> Similar Book 3", key: 3},
        {name: ofBook + " -> Similar Book 4", key: 4},
        {name: ofBook + " -> Similar Book 5", key: 5}
    ];
}

const RightBottomView: FC<RightViewPropI> = ({ofBook}) => {
    const [selected, setSelected] = useState(-1);
    const similars = getSimilars(ofBook);

    return (
        <Card title={"Similar books of book ..."} className={"similars"} array={similars}
                selected={selected} setSelected={setSelected} buttonEnabled={ofBook !== undefined}
                inputElement={InputElement.similar}/>
    );
}

export default RightBottomView;
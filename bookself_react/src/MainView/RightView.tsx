import {FC, useState} from "react";
import Card from "./List/Card.tsx";
import RightBottomView from "./RightBottomView.tsx";
import {InputElement} from "../util/enums.ts";
import {ViewableElement} from "../util/interfaces.ts";

interface RightViewPropI{
    ofFriend : string | undefined;
}

function getBooks(ofFriend: string | undefined) : ViewableElement[] {
    if(ofFriend === undefined) return [];
    return [
        {name: ofFriend + " -> Book 1", key: 1},
        {name: ofFriend + " -> Book 2", key: 2},
        {name: ofFriend + " -> Book 3", key: 3},
        {name: ofFriend + " -> Book 4", key: 4},
        {name: ofFriend + " -> Book 5", key: 5}
    ];
}

const RightView: FC<RightViewPropI> = ({ofFriend}) => {
    const [selected, setSelected] = useState(-1);
    const books = getBooks(ofFriend);

    return (
        <>
            <Card title={"Books of friend ..."} className={"books"} array={books}
                    selected={selected} setSelected={setSelected} buttonEnabled={ofFriend !== undefined}
                    inputElement={InputElement.book}/>
            <RightBottomView key={books[selected] === undefined ? undefined : books[selected].key}
                             ofBook={books[selected] === undefined ? undefined : books[selected].name}/>
        </>
    );
}

export default RightView;
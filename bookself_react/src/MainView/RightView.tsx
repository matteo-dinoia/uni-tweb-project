import {FC, useEffect, useState} from "react";
import Card from "../List/Card.tsx";
import RightBottomView from "./RightBottomView.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverGet} from "../util/serverFetch.ts";

interface RightViewPropI{
    ofFriend : string | undefined;
}

function getBooksFromServer(ofFriend : string | undefined, setBooks:  (friends : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        return data.map((element, index) => ({name: "" + element["title"], key: index}));
    };
    const params = ofFriend !== "You" ? ("?username=" + ofFriend) : "";

    return serverGet("books" + params,  arrayMan, setBooks);
}

const RightView: FC<RightViewPropI> = ({ofFriend}) => {
    const [selected, setSelected] = useState(-1);
    const [books, setBooks] = useState<ViewableElement[]>([]);
    useEffect(() => getBooksFromServer(ofFriend, setBooks), [ofFriend]);

    return (
        <>
            <Card title={"Books of friend ..."} className={"card books"} array={books}
                  selected={selected} setSelected={setSelected}
                  topBtnName={"Add"} onTopBtnClick={() => {}}
                  hasRemove={() => ofFriend === "You"}
                  onRemoveClick={(index) => {console.log("Removing Book with key=" + index);}}/>
            <RightBottomView key={books[selected] === undefined ? undefined : books[selected].key}
                             ofBook={books[selected] === undefined ? undefined : books[selected].name}/>
        </>
    );
}

export default RightView;
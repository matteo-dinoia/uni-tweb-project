import {FC, useEffect, useState} from "react";
import Card from "../List/Card.tsx";
import {InputElement} from "../util/enums.ts";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetch} from "../util/serverFetch.ts";

interface RightViewPropI{
    ofBook : string | undefined;
}

function getFriendsFromServer(ofBook : string | undefined, setFriends:  (friends : ViewableElement[]) => void){
    console.log("FETCHING BOOKS");

    if(ofBook === undefined)
        return;

    serverFetch("similars?book=" + ofBook, "get")
        .then(json => {
            if(json["error"] !== undefined){
                console.log("ERROR (in friends): " + json["error"]);
                return [];
            }
            return json["value"];
        }).then((array : {book: string, similar: string}[]) => {
        return array.map((element, index) => ({name: "" + element.similar, key: index}))
    }).then((viewableArray : ViewableElement[]) => setFriends(viewableArray));
}

const RightBottomView: FC<RightViewPropI> = ({ofBook}) => {
    const [selected, setSelected] = useState(-1);
    const [similars, setSimilars] = useState<ViewableElement[]>([]);
    useEffect(() => getFriendsFromServer(ofBook, setSimilars), [ofBook]);

    if(ofBook === undefined)
        return(<div className={"card similars"}/>);

    return (
        <div className={"card similars"}>
            <h1>{ofBook}</h1>
            <Card title={"Reviews ..."} className={"card similars"} array={similars}
                  selected={selected} setSelected={setSelected}
                  hasAdd={ofBook !== undefined} hasEdit={true} hasRemove={true}
                  inputElement={InputElement.similar}/>
            <Card title={"Similar books of book ..."} className={"card similars"} array={similars}
                        selected={selected} setSelected={setSelected}
                        hasAdd={ofBook !== undefined} hasEdit={true} hasRemove={true}
                        inputElement={InputElement.similar}/>
        </div>
    );
}

export default RightBottomView;
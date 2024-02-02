import {FC, useEffect, useState} from "react";
import Card from "../List/Card.tsx";
import RightBottomView from "./RightBottomView.tsx";
import {InputElement} from "../util/enums.ts";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetch} from "../util/serverFetch.ts";

interface RightViewPropI{
    ofFriend : string | undefined;
}

function getFriendsFromServer(ofFriend : string | undefined, setFriends:  (friends : ViewableElement[]) => void){
    console.log("FETCHING BOOKS");

    if(ofFriend === undefined)
        return;

    let params = "";
    if(ofFriend !== "You")
        params = "?username=" + ofFriend;

    serverFetch("books" + params, "get")
        .then(json => {
            if(json["error"] !== undefined){
                console.log("ERROR (in friends): " + json["error"]);
                return [];
            }
            return json["value"];
        }).then((array : {username: string, title: string}[]) => {
        return array.map((element, index) => ({name: "" + element.title, key: index}))
    }).then((viewableArray : ViewableElement[]) => setFriends(viewableArray));
}

const RightView: FC<RightViewPropI> = ({ofFriend}) => {
    const [selected, setSelected] = useState(-1);
    const [books, setBooks] = useState<ViewableElement[]>([]);
    useEffect(() => getFriendsFromServer(ofFriend, setBooks), [ofFriend]);

    return (
        <>
            <Card title={"Books of friend ..."} className={"card books"} array={books}
                  selected={selected} setSelected={setSelected}
                  hasAdd={ofFriend !== undefined} hasEdit={true} hasRemove={true}
                  inputElement={InputElement.book}/>
            <RightBottomView key={books[selected] === undefined ? undefined : books[selected].key}
                             ofBook={books[selected] === undefined ? undefined : books[selected].name}/>
        </>
    );
}

export default RightView;
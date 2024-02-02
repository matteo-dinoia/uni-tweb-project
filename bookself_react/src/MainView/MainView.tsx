import "./MainView.css"
import {FC, useEffect, useState} from "react";
import Card from "../List/Card.tsx";
import RightView from "./RightView.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetch} from "../util/serverFetch.ts";
import GlasspaneFriends from "./Glasspane/GlasspaneFriends.tsx";

function getFriendsFromServer(setFriends:  (friends : ViewableElement[]) => void){
    console.log("FETCHING FRIENDS");
    let ignore : boolean = false;

    serverFetch("friends", "get")
        .then(json => {
            if(json["error"] !== undefined){
                console.log("ERROR (in friends): " + json["error"]);
                return [];
            }
            return json["value"];
        }).then((array : {username: string, friend: string}[]) => {
            return array.map((element, index) => ({name: "" + element.friend, key: index}))
        }).then((viewableArray : ViewableElement[]) => {
            viewableArray.push({name: "You", key: -1})
            if(!ignore)
                setFriends(viewableArray);
        });

    return () => {ignore = true;}
}

function removeFreindsFromServer(toRemove : ViewableElement){
    console.log("REMOVING FRIEND with id = " + toRemove.key);
}

const MainView : FC = () => {
    const [selected, setSelected] = useState<number>(-1);
    const [friends, setFriends] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    useEffect(() => getFriendsFromServer(setFriends), []);

    return (
        <div className={"mainview"}>
            {!showDialog ? "" :
                <GlasspaneFriends closeHandler={() => setShowDialog(false)}
                                  confirmHandler={()=>setShowDialog(false)}></GlasspaneFriends>
            }

            <Card title={"Friends"} className={"card friends"} array={friends}
                    selected={selected} setSelected={(index => setSelected(index))}
                    topBtnName={"Add"} onTopBtnClick={() => setShowDialog(true)}
                    hasRemove={(index) => friends[index].name !== "You"}
                    onRemoveClick={(index) => removeFreindsFromServer(friends[index])}/>
            <RightView key={friends[selected] === undefined ? undefined : friends[selected].key}
                       ofFriend={friends[selected] === undefined ? undefined : friends[selected].name}/>
        </div>
    );
}

export default MainView;
import "./MainView.css"
import {FC, useEffect, useState} from "react";
import Card from "./List/Card.tsx";
import RightView from "./RightView.tsx";
import {InputElement} from "../util/enums.ts";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetch} from "../util/serverFetch.ts";

function getFriendsFromServer(setFriends:  (friends : ViewableElement[]) => void){
    console.log("FETCHING FRIENDS")

    serverFetch("friends", "get")
        .then(json => {
            if(json["error"] !== undefined){
                console.log("ERROR (in friends): " + json["error"]);
                return [];
            }
            return json["value"];
        }).then((array : {username: string, friend: string}[]) => {
            return array.map((element, index) => ({name: "" + element["friend"], key: index}))
        }).then((viewableArray : ViewableElement[]) => {
            viewableArray.push({name: "You", key: -1})
            setFriends(viewableArray);
        });
}

const MainView : FC = () => {
    const [selected, setSelected] = useState<number>(-1);
    const [friends, setFriends] = useState<ViewableElement[]>([]);
    useEffect(() => getFriendsFromServer(setFriends), []);

    return (
        <div className={"mainview"}>
            <Card title={"Friends"} className={"friends"} array={friends}
                    selected={selected} setSelected={(index => setSelected(index))}
                    buttonEnabled={true} inputElement={InputElement.friend}/>
            <RightView key={friends[selected] === undefined ? undefined : friends[selected].key}
                       ofFriend={friends[selected] === undefined ? undefined : friends[selected].name}/>
        </div>
    );
}

export default MainView;
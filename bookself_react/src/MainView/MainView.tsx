import "./MainView.css"
import {FC, useEffect, useState} from "react";
import Card from "../List/Card.tsx";
import RightView from "./RightView.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetch, serverGet} from "../util/serverFetch.ts";
import GlasspaneFriends from "./Glasspane/GlasspaneFriends.tsx";

function getFriendsFromServer(setFriends:  (friends : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        const array: ViewableElement[] = data.map((element, index) => ({name: "" + element["friend"], key: index, sqlData: element}))
        array.push({name: "You", key: -1, sqlData: {username: "You", friend: ""}} as never); //TODO FIX
        return array;
    };

    return serverGet("friends",  arrayMan, setFriends);
}

function removeFreindFromServer(toRemove : ViewableElement){
    return serverFetch("friends", "delete", toRemove.sqlData);
}

function addFriendToServer(toAdd : ViewableElement){
    return serverFetch("friends", "post", toAdd.sqlData);
}

const MainView : FC = () => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [selected, setSelected] = useState<number>(-1);
    const [friends, setFriends] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    useEffect(() => getFriendsFromServer(setFriends), [refreshID]);

    return (
        <div className={"mainview"}>
            {!showDialog ? "" :
                <GlasspaneFriends closeHandler={() => setShowDialog(false)}
                confirmHandler={(viewable) => {
                    if(viewable !== undefined){
                        addFriendToServer(viewable)
                            .then(() => setShowDialog(false))
                            .then(() => setRefreshID(refreshID + 1));
                    }
                }}/>
            }

            <Card title={"Friends"} className={"card friends"} array={friends}
                    selected={selected} setSelected={setSelected}
                    topBtnName={"Add"} onTopBtnClick={() => setShowDialog(true)}
                    hasRemove={(index) => friends[index].name !== "You"}
                    onRemoveClick={(index) => {
                        removeFreindFromServer(friends[index])
                            .then(() => setSelected(-1))
                            .then(() => setRefreshID(refreshID + 1));

                    }}/>
            <RightView key={friends[selected] === undefined ? undefined : friends[selected].key}
                       ofFriend={friends[selected] === undefined ? undefined : friends[selected].name}/>
        </div>
    );
}

export default MainView;
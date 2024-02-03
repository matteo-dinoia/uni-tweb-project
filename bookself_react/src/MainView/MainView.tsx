import "./MainView.css"
import {FC, useEffect, useState} from "react";
import Card from "../List/Card.tsx";
import RightView from "./RightView.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverGet} from "../util/serverFetch.ts";
import GlasspaneFriends from "./Glasspane/GlasspaneFriends.tsx";

function getFriendsFromServer(setFriends:  (friends : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        const array: ViewableElement[] = data.map((element, index) => ({name: "" + element["friend"], key: index}))
        array.push({name: "You", key: -1});
        return array;
    };

    return serverGet("friends",  arrayMan, setFriends);
}

function removeFreindsFromServer(toRemove : ViewableElement){
    console.log("REMOVING FRIEND with key = " + toRemove.key);
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
                    selected={selected} setSelected={setSelected}
                    topBtnName={"Add"} onTopBtnClick={() => setShowDialog(true)}
                    hasRemove={(index) => friends[index].name !== "You"}
                    onRemoveClick={(index) => removeFreindsFromServer(friends[index])}/>
            <RightView key={friends[selected] === undefined ? undefined : friends[selected].key}
                       ofFriend={friends[selected] === undefined ? undefined : friends[selected].name}/>
        </div>
    );
}

export default MainView;
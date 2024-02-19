import "./MainView.css"
import {FC, useContext, useEffect, useState} from "react";
import Card from "./list/Card.tsx";
import BooksView from "./BooksView.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetchJson, serverGetList} from "../util/serverFetch.ts";
import FriendsPopup from "./popup/FriendsPopup.tsx";
import {SuperuserContext} from "../App.tsx";

function getFriendsFromServer(superuser: boolean, setFriends:  (friends: ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        const array: ViewableElement[] = data.map((element, index) => (
            {name: "" + (superuser ? (element["username"]) : element["friend"]), key: index, sqlData: element}))
        if(!superuser)
            array.push({name: "You", key: -1, sqlData: {username: "You", friend: ""}} as never);
        return array;
    };

    const page = superuser ? "admin/users" : "friends";

    return serverGetList(page,  arrayMan, setFriends);
}

function removeFreindFromServer(superuser: boolean, toRemove : ViewableElement){
    if(superuser)
        return serverFetchJson("admin?user=" + toRemove.name, "delete");
    return serverFetchJson("friends", "delete", toRemove.sqlData);
}

function addFriendToServer(toAdd : ViewableElement){
    return serverFetchJson("friends", "post", toAdd.sqlData);
}

const MainView : FC = () => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [selected, setSelected] = useState<number>(-1);
    const [friends, setFriends] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const superuser = useContext(SuperuserContext);

    useEffect(() => getFriendsFromServer(superuser, setFriends), [superuser, refreshID]);

    const glasspane = <FriendsPopup closeHandler={() => setShowDialog(false)}
                                    confirmHandler={(viewable) => {
                if(viewable !== undefined){
                    addFriendToServer(viewable)
                        .then(() => setShowDialog(false))
                        .then(() => setRefreshID(refreshID + 1));
                }
            }}/>;

    return (
        <div className={"mainview"}>
            {showDialog ? glasspane : null}

            <Card title={superuser ? "Users" : "Friends"}
                    className={"card wrapper-card friends"} array={friends}
                    selected={selected} setSelected={setSelected}
                    topBtnName={!superuser ? "Add" : undefined}
                    onTopBtnClick={() => setShowDialog(true)}
                    hasRemove={(index) => friends[index].name !== "You"}
                    onRemoveClick={(index) => {
                        removeFreindFromServer(superuser, friends[index])
                            .then(() => setSelected(-1))
                            .then(() => setRefreshID(refreshID + 1));
                    }}/>
            <BooksView ofFriend={(friends[selected] === undefined || superuser) ? undefined : friends[selected].name}/>
        </div>
    );
}

export default MainView;
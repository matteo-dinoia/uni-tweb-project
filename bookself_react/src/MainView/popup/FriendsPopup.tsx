import "./Glasspane.css"
import {FC, useEffect, useState} from "react";
import Card from "../list/Card.tsx";
import {ViewableElement} from "../../util/interfaces.ts";
import {serverGetList} from "../../util/serverFetch.ts";
import {BasicGlasspanePropI, closeOnClickOutside} from "./PopupUtils.ts";


function getUsersFromServer(setFriends:  (friends : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        const array: ViewableElement[] = data.map((element, index) => ({name: "" + element["friend"], key: index, sqlData: element}))
        return array;
    };

    return serverGetList("friends?inverse=true",  arrayMan, setFriends);
}

const FriendsPopup : FC<BasicGlasspanePropI> = ({closeHandler, confirmHandler}) => {
    const [selected, setSelected] = useState<number>(-1);
    const [users, setUsers] = useState<ViewableElement[]>([]);
    useEffect(() => getUsersFromServer(setUsers), []);

    return (
        <div className={"glassPane"} onClick={(e) => closeOnClickOutside(closeHandler, e)}>
            <Card title={"Add friend"} className={"card  wrapper-card"} array={users}
                  selected={selected} setSelected={setSelected}
                  topBtnName={"Confirm Selection"} onTopBtnClick={() => confirmHandler(users[selected])}/>
        </div>
    );
}

export default FriendsPopup;
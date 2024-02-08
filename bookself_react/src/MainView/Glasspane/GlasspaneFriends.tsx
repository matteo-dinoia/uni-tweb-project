import "./Glasspane.css"
import {FC, useEffect, useState} from "react";
import Card from "../../List/Card.tsx";
import {ViewableElement} from "../../util/interfaces.ts";
import {serverGet} from "../../util/serverFetch.ts";
import {BasicGlasspanePropI, closeOnClickOutside} from "./GlasspaneUtils.ts";


function getUsersFromServer(setFriends:  (friends : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        const array: ViewableElement[] = data.map((element, index) => ({name: "" + element["friend"], key: index, sqlData: element}))
        return array;
    };

    return serverGet("friends?inverse=yes",  arrayMan, setFriends);
}

const GlasspaneFriends : FC<BasicGlasspanePropI> = ({closeHandler, confirmHandler}) => {
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

export default GlasspaneFriends;
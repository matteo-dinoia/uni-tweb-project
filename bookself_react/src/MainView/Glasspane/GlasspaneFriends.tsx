import "./Glasspane.css"
import React, {FC, useEffect, useState} from "react";
import Card from "../../List/Card.tsx";
import {ViewableElement} from "../../util/interfaces.ts";
import {serverGet} from "../../util/serverFetch.ts";

interface ContentFriendsPropI{
    closeHandler : () => void;
    confirmHandler : (obtained: ViewableElement | undefined) => void;
}

function getUsersFromServer(setFriends:  (friends : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        const array: ViewableElement[] = data.map((element, index) => ({name: "" + element["friend"], key: index, sqlData: element}))
        return array;
    };

    return serverGet("friends?inverse=yes",  arrayMan, setFriends);
}

const GlasspaneFriends : FC<ContentFriendsPropI> = ({closeHandler, confirmHandler}) => {
    const [selected, setSelected] = useState<number>(-1);
    const [users, setUsers] = useState<ViewableElement[]>([]);
    useEffect(() => getUsersFromServer(setUsers), []);

    const clickPane = (event : React.MouseEvent<HTMLElement>) => {
        if(event.target !== event.currentTarget)
            return;
        closeHandler();
    }

    return (
        <div className={"glassPane"} onClick={clickPane}>
            {/*<div className={"inputForm"}>
                <span>
                    <label style={{gridArea: "a"}}> Nome Libro </label>
                </span>
                <input style={{gridArea: "b"}}></input>
                <span>
                    <label style={{gridArea: "c"}}> Trama </label>
                </span>
                <input style={{gridArea: "d"}}></input>
                <span>
                    <label style={{gridArea: "e"}}> Tags </label>
                </span>
                <input style={{gridArea: "f"}}></input>
                <div className={"addImage"} style={{gridArea: "g"}}>
                    <span>Add image</span>
                </div>
                <button style={{gridArea: "h"}} onClick={() => closeHandler()}>Cancel</button>
                <button style={{gridArea: "i"}} onClick={() => {}}> {TODO FIX }
                    {inputAction == InputAction.newItem ? "Add" : "Delete"}
                </button>
            </div>*/}
            <Card title={"Add friend"} className={"card inputForm"} array={users}
                  selected={selected} setSelected={setSelected}
                  topBtnName={"Confirm Selection"} onTopBtnClick={() => confirmHandler(users[selected])}/>
        </div>
    );
}

export default GlasspaneFriends;
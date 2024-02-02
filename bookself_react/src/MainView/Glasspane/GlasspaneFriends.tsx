import "./Glasspane.css"
import React, {FC} from "react";
import Card from "../../List/Card.tsx";

interface ContentFriendsPropI{
    closeHandler : () => void;
    confirmHandler : () => void;
}

const GlasspaneFriends : FC<ContentFriendsPropI> = ({closeHandler, confirmHandler}) => {
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
            <Card title={"Add friend"} className={"card inputForm"} array={[{name: "lol", key: 0}]} selected={-1} setSelected={() => {}}
                  topBtnName={"Confirm Selection"} onTopBtnClick={confirmHandler}/>
        </div>
    );
}

export default GlasspaneFriends;
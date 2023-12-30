import "./GlassPane.css"
import {FC} from "react";
import {InputAction} from "../../util/enums.ts";

interface ContentFriendsPropI{
    inputAction : InputAction;
    closeHandler : () => void;
}

const ContentFriends : FC<ContentFriendsPropI> = ({closeHandler, inputAction}) => {
    console.log(inputAction);
    return (
        <div className={"inputForm"}>
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
            <button style={{gridArea: "i"}}>{inputAction.valueOf()}</button>
        </div>
    );
}

export default ContentFriends;
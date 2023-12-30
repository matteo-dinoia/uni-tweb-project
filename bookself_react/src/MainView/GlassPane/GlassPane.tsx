import "./GlassPane.css"
import {FC} from "react";
import ContentFriends from "./ContentFriends.tsx";
import {InputAction, InputElement} from "../../util/enums.ts";



interface GlassPanePropI{
    closeHandler : () => void;
    inputElement : InputElement;
    inputAction : InputAction;
}

const GlassPane : FC<GlassPanePropI> = ({closeHandler, inputElement, inputAction}) => {

    const clickPane = (event : React.MouseEvent<HTMLElement>) => {
        if(event.target !== event.currentTarget)
            return;
        closeHandler();
    }

    let content;
    switch(inputElement){
        case InputElement.friend:
            content = <ContentFriends closeHandler={closeHandler} inputAction={inputAction}/>;
            break;
        case InputElement.book:
            content = <ContentFriends closeHandler={closeHandler} inputAction={inputAction}/>;
            break;
        case InputElement.similar:
            content = <ContentFriends closeHandler={closeHandler} inputAction={inputAction}/>;
            break;
    }

    return (
        <div className={"glassPane"} onClick={clickPane}>
            {content}
        </div>
    );
}

export default GlassPane;
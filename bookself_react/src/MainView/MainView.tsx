import "./MainView.css"
import {FC, useState} from "react";
import Card from "./List/Card.tsx";
import RightView from "./RightView.tsx";
import {InputElement} from "../util/enums.ts";
import {ViewableElement} from "../util/interfaces.ts";

function getFriendsArray() : ViewableElement[] {
    return [
        {name: "You", key: 0},
        {name: "Other 1", key: 1},
        {name: "Other 2", key: 2},
        {name: "Other 3", key: 3},
        {name: "Other 4", key: 4}
    ];
}

const MainView : FC = () => {
    const [selected, setSelected] = useState(-1);
    const friends = getFriendsArray();

    return (
        <div className={"mainview"}>
            <Card title={"Friends"} className={"friends"} array={getFriendsArray()}
                    selected={selected} setSelected={(index => setSelected(index))}
                    buttonEnabled={true} inputElement={InputElement.friend}/>
            <RightView key={friends[selected] === undefined ? undefined : friends[selected].key}
                       ofFriend={friends[selected] === undefined ? undefined : friends[selected].name}/>
        </div>
    );
}

export default MainView;
import './TopBar.css'
import {FC} from "react";

interface TopBarPropI {
    username : string;
    onLogout : null | (() => void);
}

const TopBar : FC<TopBarPropI> = ({username, onLogout}) => {
    if(onLogout === null) {
        return (
            <div className={"topBar"}>
                <h1>Books suggestions</h1>
            </div>
        );
    }

    return (
        <div className={"topBar"}>
            <h1>Books suggestions</h1>
            <button>{username}</button>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}

export default TopBar;
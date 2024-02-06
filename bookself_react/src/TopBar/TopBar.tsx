import './TopBar.css'
import {FC, useContext} from "react";
import {UserContext} from "../App.tsx";

interface TopBarPropI {
    onLogout : (() => void);
}

const TopBar : FC<TopBarPropI> = ({onLogout}) => {
    const user = useContext(UserContext);

    if(user === null) {
        return (
            <div className={"topBar"}>
                <h1>Books suggestions</h1>
            </div>
        );
    }

    return (
        <div className={"topBar"}>
            <h1>Books suggestions</h1>
            <div className={"username"}>#{user}</div>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}

export default TopBar;
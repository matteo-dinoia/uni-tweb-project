import './TopBar.css'
import {FC, useContext} from "react";
import {UserContext} from "../App.tsx";

interface TopBarPropI {
    onLogout : (() => void);
}

const TopBar : FC<TopBarPropI> = ({onLogout}) => {
    const user = useContext(UserContext);

    const userBtn = <>
                <div className={"username"}>#{user}</div>
                <button onClick={onLogout}>Logout</button>
            </>;

    return (
        <div className={"topBar"}>
            <h1>Book Self</h1>
            {user !== null ? userBtn : null}
        </div>
    );
}

export default TopBar;
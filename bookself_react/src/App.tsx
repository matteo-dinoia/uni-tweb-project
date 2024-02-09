import TopBar from "./TopBar/TopBar.tsx";
import MainView from "./MainView/MainView.tsx";
import Login from "./Login/Login.tsx";
import React, {useEffect, useState} from "react";
import "./App.css"
import {serverFetchJson} from "./util/serverFetch.ts";

export const UserContext = React.createContext<string | null>(null);
export const SuperuserContext = React.createContext<boolean>(false);

function App() {
    const [username, setUsername] = useState<string | null>(null);
    const [superuser, setSuperuser] = useState<boolean>(false);

    useEffect(() => {
        serverFetchJson("login", "get")
            .then(json => {
                setUsername(json["username"]);
                setSuperuser(json["isSuperuser"]);
            })
            .catch(() => {}) // Ignore error
    }, []);

    const logout = () => serverFetchJson("logout", "get")
                            .then(() => setUsername(null));

    const login = (username : string, isSuper: boolean) => {
        setUsername(username);
        setSuperuser(isSuper);
    }

    return (
        <UserContext.Provider value={username}>
            <SuperuserContext.Provider value={superuser}>
                <TopBar onLogout={logout}/>
                {username === null
                    ? <Login onLogin={login}/>
                    : <MainView/>
                }
            </SuperuserContext.Provider>
        </UserContext.Provider>
    );
}

export default App

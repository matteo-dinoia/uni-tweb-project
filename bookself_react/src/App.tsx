import TopBar from "./TopBar/TopBar.tsx";
import MainView from "./MainView/MainView.tsx";
import Login from "./Login/Login.tsx";
import React, {useEffect, useState} from "react";
import "./App.css"
import {serverFetch} from "./util/serverFetch.ts";

export const UserContext = React.createContext<string | null>(null);
export const SuperuserContext = React.createContext<boolean>(false);

function App() {
    const [username, setUsername] = useState<string | null>(null);
    const [superuser, setSuperuser] = useState<boolean>(false);

    useEffect(() => {
        serverFetch("login", "get")
            .then(json => {
                if(json.value === undefined || json.value["username"] === undefined)
                    return;
                setUsername(json.value["username"]);
                setSuperuser(json.value["isSuperuser"]);

            })
    }, []);

    const logout = () => serverFetch("logout", "get")
                            .then(() => setUsername(null));

    const login = (username : string, isSuper: boolean) => {
        setUsername(username);
        setSuperuser(isSuper);
    }
    console.log(username, superuser);

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

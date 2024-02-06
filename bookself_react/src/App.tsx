import TopBar from "./TopBar/TopBar.tsx";
import MainView from "./MainView/MainView.tsx";
import Login from "./Login/Login.tsx";
import React, {useState} from "react";
import "./App.css"

export const UserContext = React.createContext<string | null>(null);

function App() {
    const [username, setUsername] = useState<string | null>(null);

    const main = username === null ? <Login onLogin={setUsername}/> : <MainView/>;

    return (
        <UserContext.Provider value={username}>
            <TopBar onLogout={() =>setUsername(null)}/>
            {main}
        </UserContext.Provider>
    );
}

export default App

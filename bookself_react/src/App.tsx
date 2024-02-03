import TopBar from "./TopBar/TopBar.tsx";
import MainView from "./MainView/MainView.tsx";
import Login from "./Login/Login.tsx";
import {useState} from "react";
import "./App.css"

function App() {
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState("");

    if(!logged)
        return <><TopBar username={""} onLogout={null}/>
                <Login onLogin={(username) => {
                    setLogged(true);
                    setUsername(username);
                }}/></>;
    else
        return <>
            <TopBar username={username} onLogout={() =>{
                setLogged(false);
                setUsername("");
            }}/>
            <MainView/>
        </>;
}

export default App

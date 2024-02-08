import "./Login.css"
import {FC, useState} from "react";
import {serverFetch} from "../util/serverFetch.ts";

interface LoginPropI{
    onLogin: (username: string, superuser: boolean) => void;
}

function checkLogin(username: string, password: string, isSignup: boolean,
                    onLogin:  (username: string, superuser: boolean) => void, onError: (error: string) => void) : void{
    const page = "login" + (isSignup ? "?signup=true" : "");

    serverFetch(page, "post", {
            username: username,
            password: password
        }).then(json => {
            if(json["error"] !== undefined)
                onError("ERROR: " + json["error"]);
            else
                onLogin(json.value["username"], json.value["isSuperuser"])
        });
}

const Login : FC<LoginPropI> = ({onLogin}) => {

    const [username, setUsername] = useState<string>("usertag");
    const [password, setPassword] = useState<string>("password");
    const [error, setError] = useState<string>("");

    return (
        <div className={"loginForm"}>
            <span style={{gridArea: "a"}}>
                <h2>Login</h2>
            </span>

            <span style={{gridArea: "b"}}>
                <label> Username </label>
            </span>
            <input style={{gridArea: "c"}} onChange={(e) => setUsername(e.target.value)} value={username}/>
            <span style={{gridArea: "d"}}>
                <label> Password </label>
            </span>
            <input type="password" style={{gridArea: "e"}} onChange={(e) => setPassword(e.target.value)} value={password}/>
            <span className={"errorMsg"} style={{gridArea: "f"}}>
                <label>{error}</label>
            </span>
            <button style={{gridArea: "g"}} onClick={() => checkLogin(username, password, true, onLogin, setError)}>Register
            </button>
            <button style={{gridArea: "h"}} onClick={() => checkLogin(username, password, false, onLogin, setError)}>Login
            </button>
        </div>
    );
}

export default Login;
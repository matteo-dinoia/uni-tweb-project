import "./Login.css"
import {FC, useState} from "react";

interface LoginPropI{
    onLogin: (username : string, password : string) => void;
}

const Login : FC<LoginPropI> = ({onLogin}) => {

    const [username, setUsername] = useState("TestUsername");
    const [password, setPassword] = useState("password");

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
            <button style={{gridArea: "f"}} onClick={() => onLogin(username, password)}>Register</button>
            <button style={{gridArea: "g"}} onClick={() => onLogin(username, password)}>Login</button>
        </div>
    );
}

export default Login;
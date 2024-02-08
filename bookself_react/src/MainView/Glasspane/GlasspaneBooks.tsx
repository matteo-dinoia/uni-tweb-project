import "./Glasspane.css"
import {FC, useContext, useEffect, useState} from "react";
import Card from "../../List/Card.tsx";
import {ViewableElement} from "../../util/interfaces.ts";
import {serverGetList} from "../../util/serverFetch.ts";
import {BasicGlasspanePropI, closeOnClickOutside} from "./GlasspaneUtils.ts";
import {SuperuserContext} from "../../App.tsx";

function getUsersFromServer(setBooks:  (books : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        const array: ViewableElement[] = data.map((element, index) => ({name: "" + element["title"], key: index, sqlData: element}))
        return array;
    };

    return serverGetList("books?inverse=yes",  arrayMan, setBooks);
}

const SuperuserAdder : FC<BasicGlasspanePropI> = ({closeHandler, confirmHandler}) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const review : ViewableElement = {
        key: -2,
        name: title,
        subtext: description,
        sqlData: {
            title: title,
            description: description
        } as never
    };

    return (
        <div className={"glassPane"} onClick={(e) => closeOnClickOutside(closeHandler, e)}>
            <div className={"inputForm wrapper-card"}>
                    <span>
                        <label style={{gridArea: "a"}}> Titolo Commento </label>
                    </span>
                <input style={{gridArea: "b"}} onChange={(e) => setTitle(e.target.value)} value={title} maxLength={30}/>
                <span>
                        <label style={{gridArea: "c"}}> Commento Testo </label>
                    </span>
                <textarea style={{gridArea: "d"}} onChange={(e) => setDescription(e.target.value)} value={description} maxLength={500}/>
                <button style={{gridArea: "h"}} onClick={closeHandler}>Cancel</button>
                <button style={{gridArea: "i"}} onClick={() => {if(title !== "" && description !== "") confirmHandler(review)}}
                        disabled={title === "" || description === ""}>Confirm</button>
            </div>
        </div>
    );
}

const NormalAdder : FC<BasicGlasspanePropI> = ({closeHandler, confirmHandler}) => {
    const [selected, setSelected] = useState<number>(-1);
    const [books, setBooks] = useState<ViewableElement[]>([]);
    useEffect(() => getUsersFromServer(setBooks), []);

    return (
        <div className={"glassPane"} onClick={(e) => closeOnClickOutside(closeHandler, e)}>
            <Card title={"Add book"} className={"card wrapper-card"} array={books}
                  selected={selected} setSelected={setSelected}
                  topBtnName={"Confirm Selection"} onTopBtnClick={() => confirmHandler(books[selected])}/>
        </div>
    );
}

const GlasspaneBooks : FC<BasicGlasspanePropI> = ({closeHandler, confirmHandler}) => {
    const superuser = useContext(SuperuserContext);

    if(superuser)
        return <SuperuserAdder closeHandler={closeHandler} confirmHandler={confirmHandler}/>;

    return <NormalAdder closeHandler={closeHandler} confirmHandler={confirmHandler}/>;
}

export default GlasspaneBooks;
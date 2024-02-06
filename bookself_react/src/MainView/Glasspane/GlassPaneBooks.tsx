import "./Glasspane.css"
import React, {FC, useEffect, useState} from "react";
import Card from "../../List/Card.tsx";
import {ViewableElement} from "../../util/interfaces.ts";
import {serverGet} from "../../util/serverFetch.ts";

interface ContentBooksPropI{
    closeHandler : () => void;
    confirmHandler : (obtained: ViewableElement | undefined) => void;
}

function getUsersFromServer(setBooks:  (books : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        console.log(data);
        const array: ViewableElement[] = data.map((element, index) => ({name: "" + element["title"], key: index, sqlData: element}))
        return array;
    };

    return serverGet("books?inverse=yes",  arrayMan, setBooks);
}

const GlasspaneBooks : FC<ContentBooksPropI> = ({closeHandler, confirmHandler}) => {
    const [selected, setSelected] = useState<number>(-1);
    const [books, setBooks] = useState<ViewableElement[]>([]);
    useEffect(() => getUsersFromServer(setBooks), []);

    const clickPane = (event : React.MouseEvent<HTMLElement>) => {
        if(event.target !== event.currentTarget)
            return;
        closeHandler();
    }

    return (
        <div className={"glassPane"} onClick={clickPane}>
            <Card title={"Add book"} className={"card inputForm"} array={books}
                  selected={selected} setSelected={setSelected}
                  topBtnName={"Confirm Selection"} onTopBtnClick={() => confirmHandler(books[selected])}/>
        </div>
    );
}

export default GlasspaneBooks;
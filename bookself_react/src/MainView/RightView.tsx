import {FC, useEffect, useState} from "react";
import Card from "../List/Card.tsx";
import RightBottomView from "./RightBottomView.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetch, serverGet} from "../util/serverFetch.ts";
import GlasspaneBooks from "./Glasspane/GlassPaneBooks.tsx";

interface RightViewPropI{
    ofFriend : string | undefined;
}

function getBooksFromServer(ofFriend : string | undefined, setBooks:  (friends : ViewableElement[]) => void){
    const arrayMan = (data: never[]) => {
        return data.map((element, index) => ({name: "" + element["title"], key: index, sqlData: element}));
    };
    const params = ofFriend !== "You" ? ("?username=" + ofFriend) : "";

    return serverGet("books" + params,  arrayMan, setBooks);
}

function removeBookFromLibraryInServer(toRemove: ViewableElement) {
    return serverFetch("books", "delete", toRemove.sqlData);
}

function addBookToLibraryInServer(toAdd: ViewableElement) {
    return serverFetch("books", "post", toAdd.sqlData);
}

const RightView: FC<RightViewPropI> = ({ofFriend}) => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [selected, setSelected] = useState(-1);
    const [books, setBooks] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    useEffect(() => getBooksFromServer(ofFriend, setBooks), [ofFriend, refreshID]);

    return (
        <>
            {!showDialog ? "" :
                <GlasspaneBooks closeHandler={() => setShowDialog(false)}
                    confirmHandler={(viewable) => {
                        if(viewable !== undefined){
                            addBookToLibraryInServer(viewable)
                                .then(() => setShowDialog(false))
                                .then(() => setRefreshID(refreshID + 1));
                        }
                }}/>
            }

            <Card title={"Books of friend ..."} className={"card books"} array={books}
                  selected={selected} setSelected={setSelected}
                  topBtnName={"Add"}
                  onTopBtnClick={ofFriend === "You" ? (() => setShowDialog(true)) : undefined}
                  hasRemove={() => ofFriend === "You"}
                  onRemoveClick={(index) => {
                      removeBookFromLibraryInServer(books[index])
                          .then(() => setSelected(-1))
                          .then(() => setRefreshID(refreshID + 1));
                  }}/>
            <RightBottomView key={books[selected] === undefined ? undefined : books[selected].key}
                             ofBook={books[selected] === undefined ? undefined : books[selected].name}/>
        </>
    );
}

export default RightView;
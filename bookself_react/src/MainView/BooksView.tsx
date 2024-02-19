import {FC, useContext, useEffect, useState} from "react";
import Card from "./list/Card.tsx";
import DetailsView from "./DetailsView.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetchJson, serverGetList} from "../util/serverFetch.ts";
import BooksPopup from "./popup/BooksPopup.tsx";
import {SuperuserContext} from "../App.tsx";

interface RightViewPropI{
    ofFriend : string | undefined;
}

function getBooksFromServer(superuser: boolean, ofFriend : string | undefined, setBooks:  (friends : ViewableElement[]) => void){
    if(!superuser && ofFriend === undefined)
        return () => {};

    const arrayMan = (data: never[]) => {
        return data.map((element, index) => ({name: "" + element["title"], key: index, sqlData: element}));
    };

    const page = superuser ? "admin/books" :
        (ofFriend !== "You" ? ("books?username=" + ofFriend) : "books");

    return serverGetList(page,  arrayMan, setBooks);
}

function removeBookFromLibraryInServer(superuser: boolean, toRemove: ViewableElement) {
    if(superuser)
        return serverFetchJson("admin?book=" + toRemove.name, "delete");
    return serverFetchJson("books", "delete", toRemove.sqlData);
}

function addBookToLibraryInServer(toAdd: ViewableElement) {
    return serverFetchJson("books", "post", toAdd.sqlData);
}

function addBookGloballyInServer(toAdd: ViewableElement) {
    return serverFetchJson("admin", "post", toAdd.sqlData);
}

const BooksView: FC<RightViewPropI> = ({ofFriend}) => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [selected, setSelected] = useState(-1);
    const [books, setBooks] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const superuser = useContext(SuperuserContext);

    useEffect(() => setSelected(-1), [ofFriend]);
    useEffect(() => getBooksFromServer(superuser, ofFriend, setBooks), [superuser, ofFriend, refreshID]);

    const editable = ofFriend === "You" || superuser;

    const glasspane = <BooksPopup closeHandler={() => setShowDialog(false)}
                                  confirmHandler={(viewable) => {
                if(viewable !== undefined){
                    let adding;
                    if(superuser){
                        adding = addBookGloballyInServer(viewable);
                    }else{
                        adding = addBookToLibraryInServer(viewable);
                    }
                    adding.then(() => setShowDialog(false))
                        .then(() => setRefreshID(refreshID + 1));
                }
            }}/>;

    return (
        <>
            {showDialog ? glasspane : null}

            <Card title={superuser ? "Books" : "Books of friend ..."}
                  className={"card  wrapper-card books"} array={books}
                  selected={selected} setSelected={setSelected}
                  topBtnName={editable ? (superuser ? "Add globally" : "Add") : undefined}
                  onTopBtnClick={() => setShowDialog(true)}
                  hasRemove={() => editable}
                  onRemoveClick={(index) => {
                      removeBookFromLibraryInServer(superuser, books[index])
                          .then(() => setSelected(-1))
                          .then(() => setRefreshID(refreshID + 1));
                  }}/>
            <DetailsView key={books[selected] === undefined ? undefined : books[selected].key}
                         ofBook={books[selected] === undefined ? undefined : books[selected].name}/>
        </>
    );
}

export default BooksView;
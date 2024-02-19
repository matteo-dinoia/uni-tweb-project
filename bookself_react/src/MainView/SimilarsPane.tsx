import {FC, useContext, useEffect, useState} from "react";
import {ViewableElement} from "../util/interfaces.ts";
import {SuperuserContext} from "../App.tsx";
import {groupBy} from "../util/utils.ts";
import SimilarsPopup from "./popup/SimilarsPopup.tsx";
import Card from "./list/Card.tsx";
import {serverFetchJson, serverGetList} from "../util/serverFetch.ts";

interface SimilarsPanePropI{
    user: string | null;
    ofBook: string | undefined;
    selected: number;
    setSelected: (index: number) => void;
}

function getSimilarsFromServer(ofBook : string | undefined, setSimilars:  (friends : ViewableElement[]) => void){
    if(ofBook === undefined) return;

    const arrayMan = (data: never[]) => {
        return data.map((element, index) => ({name: "" + element["similar"], key: index, sqlData: element}));
    };

    return serverGetList("similars?book=" + ofBook,  arrayMan, setSimilars);
}

function removeSimilarFromServer(toRemove : ViewableElement){
    return serverFetchJson("similars", "delete", toRemove.sqlData);
}

function addSimilarToServer(toAdd: ViewableElement) {
    return serverFetchJson("similars", "post", toAdd.sqlData);
}

const SimilarsPane : FC<SimilarsPanePropI> = ({user, ofBook, selected, setSelected}) => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [similars, setSimilars] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const superuser = useContext(SuperuserContext);

    useEffect(() => getSimilarsFromServer(ofBook, setSimilars), [ofBook, refreshID]);

    const grouped: ViewableElement[] = groupBy(similars, (element) => element.name)
        .sort((a, b) => b.length - a.length)
        .map((list, index) => {
            const found = list.find(element => element.sqlData["username"] === user)
            return ({name: list[0]["name"] + " (" + list.length + " person/people)", key: index,
                sqlData: (found === undefined ? list[0].sqlData : found.sqlData)  as never});
        });

    const glasspane = <SimilarsPopup ofBook={ofBook}
                                     closeHandler={() => setShowDialog(false)}
                                     confirmHandler={(viewable) => {
                    if(viewable !== undefined){
                        addSimilarToServer(viewable)
                            .then(() => setShowDialog(false))
                            .then(() => setRefreshID(refreshID + 1));
                    }
            }}/>;

    return (
        <>
            {!showDialog || ofBook === undefined ? null : glasspane}

            <Card title={"Similar books of book ..."} className={"card similars"} array={grouped}
                selected={selected} setSelected={setSelected}
                topBtnName={!superuser ? "Add" : undefined}
                onTopBtnClick={() => setShowDialog(true)}
                hasRemove={(index) => grouped[index].sqlData["username"] === user && !superuser}
                onRemoveClick={(index) => {
                    removeSimilarFromServer(grouped[index])
                        .then(() => setSelected(-1))
                        .then(() => setRefreshID(refreshID + 1));}
            }/>
        </>
    );
}

export default SimilarsPane;
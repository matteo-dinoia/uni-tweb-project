import {FC, useContext, useEffect, useState} from "react";
import Card from "./List/Card.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetchJson, serverGetList} from "../util/serverFetch.ts";
import {SuperuserContext, UserContext} from "../App.tsx";
import GlasspaneSimilars from "./Glasspane/GlasspaneSimilars.tsx";
import GlasspaneReviews from "./Glasspane/GlasspaneReviews.tsx";

interface RightViewPropI{
    ofBook: string | undefined;
}

interface ReviewsPropI{
    user: string | null;
    ofBook: string | undefined;
    selected: number;
    setSelected: (index: number) => void;
}

interface SimilarsPropI{
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

function getReviewsFromServer(ofBook : string | undefined, setReviews:  (friends : ViewableElement[]) => void){
    if(ofBook === undefined) return;

    const arrayMan = (data: never[]) => {
        return data.map((element, index) => ({name: "" + element["commenttitle"], subtext: element["commenttext"], key: index, sqlData: element}));
    };

    return serverGetList("reviews?book=" + ofBook,  arrayMan, setReviews);
}

function removeSimilarFromServer(toRemove : ViewableElement){
    return serverFetchJson("similars", "delete", toRemove.sqlData);
}

function addSimilarToServer(toAdd: ViewableElement) {
    return serverFetchJson("similars", "post", toAdd.sqlData);
}

function removeReviewFromServer(toRemove : ViewableElement){
    return serverFetchJson("reviews", "delete", toRemove.sqlData);
}

function addReviewToServer(toAdd: ViewableElement) {
    return serverFetchJson("reviews", "post", toAdd.sqlData);
}

const ReviewsView : FC<ReviewsPropI> = ({user, ofBook, selected, setSelected}) => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [reviews, setReviews] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const superuser = useContext(SuperuserContext);

    useEffect(() => getReviewsFromServer(ofBook, setReviews), [ofBook, refreshID]);

    return (
        <>
            {!showDialog || ofBook === undefined ? "" :
                <GlasspaneReviews ofBook={ofBook}
                    closeHandler={() => setShowDialog(false)}
                    confirmHandler={(viewable) => {
                        if(viewable !== undefined){
                            addReviewToServer(viewable)
                                .then(() => setShowDialog(false))
                                .then(() => setRefreshID(refreshID + 1));
                        }
                    }}/>
            }

            <Card title={"Reviews ..."} className={"card similars"} array={reviews}
                  selected={selected} setSelected={setSelected}
                  topBtnName={!superuser ? "Add" : undefined}
                  onTopBtnClick={() => setShowDialog(true)}
                  hasRemove={(index) => reviews[index].sqlData["username"] === user || superuser}
                  onRemoveClick={(index) => {
                      removeReviewFromServer(reviews[index])
                          .then(() => setSelected(-1))
                          .then(() => setRefreshID(refreshID + 1));}
                  }/>
        </>
    );
}

const SimilarsView : FC<SimilarsPropI> = ({user, ofBook, selected, setSelected}) => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [similars, setSimilars] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const superuser = useContext(SuperuserContext);

    useEffect(() => getSimilarsFromServer(ofBook, setSimilars), [ofBook, refreshID]);


    return (
        <>
            {!showDialog || ofBook === undefined ? "" :
                <GlasspaneSimilars ofBook={ofBook}
                    closeHandler={() => setShowDialog(false)}
                    confirmHandler={(viewable) => {
                        if(viewable !== undefined){
                            addSimilarToServer(viewable)
                            .then(() => setShowDialog(false))
                            .then(() => setRefreshID(refreshID + 1));
                        }
                    }}/>
            }
            <Card title={"Similar books of book ..."} className={"card similars"} array={similars}
                    selected={selected} setSelected={setSelected}
                    topBtnName={!superuser ? "Add" : undefined}
                    onTopBtnClick={() => setShowDialog(true)}
                    hasRemove={(index) => similars[index].sqlData["username"] === user || superuser}
                    onRemoveClick={(index) => {
                        removeSimilarFromServer(similars[index])
                            .then(() => setSelected(-1))
                            .then(() => setRefreshID(refreshID + 1));}
                    }/>
        </>

    );
}

function getBookFromServer(ofBook: string | undefined, setViewableBook: (value: ViewableElement | undefined) => void) {
    if(ofBook === undefined)
        return;

    return serverFetchJson("books?info=" + ofBook, "get")
        .then(json => {
            const element: ViewableElement = {name: json["title"], key: -2, subtext: json["description"], sqlData: (json as never)};
            setViewableBook(element);
        });
    //TODO fix server side
}

const RightBottomView: FC<RightViewPropI> = ({ofBook}) => {
    const [selectedSim, setSelectedSim] = useState(-1);
    const [selectedRev, setSelectedRev] = useState(-1);
    const [viewableBook, setViewableBook] = useState<ViewableElement | undefined>(undefined);
    const user = useContext(UserContext);

    useEffect(() => { getBookFromServer(ofBook, setViewableBook); }, [ofBook])

    if(ofBook === undefined)
        return(<div className={"card wrapper-card similars"}/>);

    return (
        <div className={"card  wrapper-card similars"}>
            <h1>{ofBook}</h1>
            <p>{viewableBook !== undefined ? viewableBook.subtext : undefined}</p>

            <ReviewsView user={user} ofBook={ofBook} selected={selectedRev}
                         setSelected={(index) => {
                             setSelectedRev(index);
                             setSelectedSim(-1);
                         }}/>
            <SimilarsView user={user} ofBook={ofBook} selected={selectedSim}
                          setSelected={(index) => {
                              setSelectedSim(index);
                              setSelectedRev(-1);
                          }}/>
        </div>
    );
}

export default RightBottomView;
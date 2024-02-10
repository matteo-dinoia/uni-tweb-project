import {FC, useContext, useEffect, useState} from "react";
import Card from "./List/Card.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetchJson, serverGetList} from "../util/serverFetch.ts";
import {SuperuserContext, UserContext} from "../App.tsx";
import GlasspaneSimilars from "./Glasspane/GlasspaneSimilars.tsx";
import GlasspaneReviews from "./Glasspane/GlasspaneReviews.tsx";
import StarRating from "./smallComponent/StarRating.tsx";
import {groupBy} from "../util/utils.ts";

interface RightViewPropI{
    ofBook: string | undefined;
}

interface ReviewsPropI{
    user: string | null;
    ofBook: string | undefined;
    selected: number;
    setSelected: (index: number) => void;
    setValutationMean : (mean: number) => void;
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
        return data.map((element, index) => ({name: element["commenttitle"] + " (" + element["valutation"] + "★)", subtext: element["commenttext"], key: index, sqlData: element}));
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

const ReviewsView : FC<ReviewsPropI> = ({user, ofBook, selected, setSelected, setValutationMean}) => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [reviews, setReviews] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const superuser = useContext(SuperuserContext);

    useEffect(() => {getReviewsFromServer(ofBook, setReviews)}, [ofBook, refreshID]);
    useEffect(() => {
        const sum: number = reviews.map(rev => rev.sqlData["valutation"]).reduce((partialSum, a) => partialSum + a, 0);
        const mean: number = sum / reviews.length;
        setValutationMean(mean === undefined || isNaN(mean) ? -1 : mean);
    }, [reviews]);

    const isEdit = reviews.find(el => el.sqlData["username"] === user) !== undefined;

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

            <Card title={"Reviews ..."} className={"card reviews"} array={reviews}
                  selected={selected} setSelected={setSelected}
                  topBtnName={!superuser ? (isEdit ? "Override review" : "Add") : undefined}
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

    const grouped: ViewableElement[] = Object.entries(groupBy(similars, (element) => element.name))
        .map(format => format[1])
        .sort((a, b) => b.length - a.length)
        .map((list, index) => {
            const found = list.find(element => element.sqlData["username"] === user)
            return ({name: list[0]["name"] + " (" + list.length + " person/people)", key: index,
                sqlData: (found === undefined ? list[0].sqlData : found.sqlData)  as never});
        });

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

function getBookFromServer(ofBook: string | undefined, setViewableBook: (value: ViewableElement | undefined) => void) {
    if(ofBook === undefined)
        return;

    return serverFetchJson("series?title=" + ofBook, "get")
        .then(json => {
            const element: ViewableElement = {name: json["title"], key: -2, subtext: json["description"], sqlData: (json as never)};
            setViewableBook(element);
        });
}

const RightBottomView: FC<RightViewPropI> = ({ofBook}) => {
    const [selectedSim, setSelectedSim] = useState(-1);
    const [selectedRev, setSelectedRev] = useState(-1);
    const [mean, setMean] = useState<number>(-1);
    const [viewableBook, setViewableBook] = useState<ViewableElement | undefined>(undefined);
    const user = useContext(UserContext);

    useEffect(() => setSelectedSim(-1), [ofBook]);
    useEffect(() => setSelectedRev(-1), [ofBook]);
    useEffect(() => { getBookFromServer(ofBook, setViewableBook); }, [ofBook])

    if(ofBook === undefined || viewableBook === undefined || mean < -1)
        return(<div className={"card wrapper-card right"}/>);

    const description = viewableBook.sqlData["description"] === undefined ? "Missing description" : viewableBook.sqlData["description"];
    const srcImg = viewableBook.sqlData["imageLink"] !== undefined ? viewableBook.sqlData["imageLink"]
        : "https://media.istockphoto.com/vectors/no-image-available-icon-vector-id1216251206?k=20&m=1216251206&s=170667a&w=0&h=A72dFkHkDdSfmT6iWl6eMN9t_JZmqGeMoAycP-LMAw4=";

    return (
        <div className={"card  wrapper-card right"}>
            <h2>{ofBook}</h2>
            <StarRating star={mean}/>
            <img src={srcImg} alt={"Image of the selected book"} className={"imgBook"}/>
            {description.split("\n").map((piece, index) => <p key={index} className={"descriptionBook"}>{piece}</p>)}
            <div style={{clear: "both"}}></div>

            <ReviewsView user={user} ofBook={ofBook} selected={selectedRev}
                         setSelected={(index) => {
                             setSelectedRev(index);
                             setSelectedSim(-1);
                         }}
                         setValutationMean={mean => setMean(mean)}/>
            <SimilarsView user={user} ofBook={ofBook} selected={selectedSim}
                          setSelected={(index) => {
                              setSelectedSim(index);
                              setSelectedRev(-1);
                          }}/>
        </div>
    );
}

export default RightBottomView;
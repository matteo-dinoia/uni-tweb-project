import {ViewableElement} from "../util/interfaces.ts";
import {serverFetchJson, serverGetList} from "../util/serverFetch.ts";
import {FC, useContext, useEffect, useState} from "react";
import {SuperuserContext} from "../App.tsx";
import ReviewsPopup from "./popup/ReviewsPopup.tsx";
import Card from "./list/Card.tsx";

interface ReviewsPanePropI{
    user: string | null;
    ofBook: string | undefined;
    selected: number;
    setSelected: (index: number) => void;
    setValutationMean : (mean: number) => void;
}

function getReviewsFromServer(ofBook : string | undefined, setReviews:  (friends : ViewableElement[]) => void){
    if(ofBook === undefined) return;

    const arrayMan = (data: never[]) => {
        return data.map((element, index) => ({name: element["commenttitle"] + " (" + element["valutation"] + "★)", subtext: element["commenttext"], key: index, sqlData: element}));
    };

    return serverGetList("reviews?book=" + ofBook,  arrayMan, setReviews);
}

function removeReviewFromServer(toRemove : ViewableElement){
    return serverFetchJson("reviews", "delete", toRemove.sqlData);
}

function addReviewToServer(toAdd: ViewableElement) {
    return serverFetchJson("reviews", "post", toAdd.sqlData);
}

const ReviewsPane : FC<ReviewsPanePropI> = ({user, ofBook, selected, setSelected, setValutationMean}) => {
    const [refreshID, setRefreshID] = useState<number>(0);
    const [reviews, setReviews] = useState<ViewableElement[]>([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const superuser = useContext(SuperuserContext);

    useEffect(() => {getReviewsFromServer(ofBook, setReviews)}, [ofBook, refreshID]);
    useEffect(() => {
        const sum: number = reviews.map(rev => rev.sqlData["valutation"]).reduce((partialSum, a) => partialSum + a, 0);
        const mean: number = sum / reviews.length;
        setValutationMean(mean === undefined || isNaN(mean) ? -1 : mean);
    }, [reviews, setValutationMean]);

    const isEdit = reviews.find(el => el.sqlData["username"] === user) !== undefined;

    const glasspane = <ReviewsPopup ofBook={ofBook} overwrite={isEdit}
                                    closeHandler={() => setShowDialog(false)}
                                    confirmHandler={(viewable) => {
                    if(viewable !== undefined){
                        addReviewToServer(viewable)
                            .then(() => setShowDialog(false))
                            .then(() => setRefreshID(refreshID + 1));
                    }
                }}
            />;

    return (
        <>
            {!showDialog || ofBook === undefined ? null : glasspane}

            <Card title={"Reviews ..."} className={"card reviews"} array={reviews}
                selected={selected} setSelected={setSelected}
                topBtnName={!superuser ? (isEdit ? "Override review" : "Add") : undefined}
                onTopBtnClick={() => setShowDialog(true)}
                hasRemove={(index) => reviews[index].sqlData["username"] === user || superuser}
                onRemoveClick={(index) => {
                    removeReviewFromServer(reviews[index])
                        .then(() => setSelected(-1))
                        .then(() => setRefreshID(refreshID + 1));}
                }
            />
        </>
    );
}

export default ReviewsPane;
import {FC, useContext, useEffect, useState} from "react";
import Card from "../List/Card.tsx";
import {ViewableElement} from "../util/interfaces.ts";
import {serverGet} from "../util/serverFetch.ts";
import {UserContext} from "../App.tsx";

interface RightViewPropI{
    ofBook : string | undefined;
}

function getSimilarsFromServer(ofBook : string | undefined, setSimilars:  (friends : ViewableElement[]) => void){
    if(ofBook === undefined) return;

    const arrayMan = (data: never[]) => {
        return data.map((element, index) => ({name: "" + element["similar"], key: index, sqlData: element}));
    };

    return serverGet("similars?book=" + ofBook,  arrayMan, setSimilars);
}

function getReviewsFromServer(ofBook : string | undefined, setReviews:  (friends : ViewableElement[]) => void){
    if(ofBook === undefined) return;

    const arrayMan = (data: never[]) => {
        return data.map((element, index) => ({name: "" + element["commenttitle"], subtext: element["commenttext"], key: index, sqlData: element}));
    };

    return serverGet("reviews?book=" + ofBook,  arrayMan, setReviews);
}

const RightBottomView: FC<RightViewPropI> = ({ofBook}) => {
    const [selectedSim, setSelectedSim] = useState(-1);
    const [selectedRev, setSelectedRev] = useState(-1);
    const [similars, setSimilars] = useState<ViewableElement[]>([]);
    const [reviews, setReviews] = useState<ViewableElement[]>([]);
    useEffect(() => getSimilarsFromServer(ofBook, setSimilars), [ofBook]);
    useEffect(() => getReviewsFromServer(ofBook, setReviews), [ofBook]);
    const user = useContext(UserContext);

    if(ofBook === undefined)
        return(<div className={"card similars"}/>);

    return (
        <div className={"card similars"}>
            <h1>{ofBook}</h1>
            <Card title={"Reviews ..."} className={"card similars"} array={reviews}
                  selected={selectedRev} setSelected={(index) => {setSelectedRev(index); setSelectedSim(-1);}}
                  topBtnName={"Add"} onTopBtnClick={() => {}}
                  hasRemove={(index) => reviews[index].sqlData["username"] === user}
                  onRemoveClick={() => {}}/>
            <Card title={"Similar books of book ..."} className={"card similars"} array={similars}
                  selected={selectedSim} setSelected={(index) => {setSelectedRev(-1); setSelectedSim(index);}}
                  topBtnName={"Add"} onTopBtnClick={() => {}}
                  hasRemove={(index) => similars[index].sqlData["username"] === user}
                  onRemoveClick={() => {}}/>
        </div>
    );
}

export default RightBottomView;
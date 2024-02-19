import {FC, useContext, useEffect, useState} from "react";
import {ViewableElement} from "../util/interfaces.ts";
import {serverFetchJson} from "../util/serverFetch.ts";
import {UserContext} from "../App.tsx";
import StarRating from "./smallComponent/StarRating.tsx";
import SimilarsPane from "./SimilarsPane.tsx";
import ReviewsPane from "./ReviewsPane.tsx";

interface DetailsViewPropI{
    ofBook: string | undefined;
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

const DetailsView: FC<DetailsViewPropI> = ({ofBook}) => {
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

            <ReviewsPane user={user} ofBook={ofBook} selected={selectedRev}
                         setValutationMean={setMean}
                         setSelected={(index) => {
                             setSelectedRev(index);
                             setSelectedSim(-1);
                         }}/>
            <SimilarsPane user={user} ofBook={ofBook} selected={selectedSim}
                          setSelected={(index) => {
                              setSelectedSim(index);
                              setSelectedRev(-1);
                          }}/>
        </div>
    );
}

export default DetailsView;
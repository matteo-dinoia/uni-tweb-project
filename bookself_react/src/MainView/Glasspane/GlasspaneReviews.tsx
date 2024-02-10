import "./Glasspane.css"
import {FC, useContext, useState} from "react";
import {BasicGlasspanePropI, closeOnClickOutside} from "./GlasspaneUtils.ts";
import {ViewableElement} from "../../util/interfaces.ts";
import {UserContext} from "../../App.tsx";
import BtnTitle from "../smallComponent/BtnTitle.tsx";
import StarRating from "../smallComponent/StarRating.tsx";

interface ReviewGlasspanePropI extends  BasicGlasspanePropI{
    ofBook: string;
}

const GlasspaneReviews : FC<ReviewGlasspanePropI> = ({closeHandler, confirmHandler, ofBook}) => {
    const [title, setTitle] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [star, setStar] = useState<number>(-1);
    const user = useContext(UserContext);

    const review : ViewableElement = {
        key: -2,
        name: title,
        subtext: comment,
        sqlData: {
            username: user,
            book: ofBook,
            commenttitle: title,
            commenttext: comment,
            valutation: star
        } as never
    };

    return (
        <div className={"glassPane"} onClick={(e) => closeOnClickOutside(closeHandler, e)}>
            <div className={"inputForm wrapper-card"}>
                <BtnTitle title={"Add a review to '" + ofBook + "'"} disabled={title === "" || comment === "" || star <= 0}
                          topBtnName={"Confirm"} onTopBtnClick={() => confirmHandler(review)} style={{gridArea: "h"}}/>

                <span>
                    <label style={{gridArea: "a"}}>Title Comment</label>
                </span>
                <input style={{gridArea: "b"}} onChange={(e) => setTitle(e.target.value)} value={title} maxLength={30}/>
                <span>
                    <label style={{gridArea: "a"}}>Star Rating</label>
                </span>
                <StarRating star={star} setStar={setStar}/>
                <span>
                    <label style={{gridArea: "c"}}>Comment Text </label>
                </span>
                <textarea style={{gridArea: "d"}} onChange={(e) => setComment(e.target.value)} value={comment}
                          maxLength={500}/>
            </div>
        </div>
    );
}

export default GlasspaneReviews;
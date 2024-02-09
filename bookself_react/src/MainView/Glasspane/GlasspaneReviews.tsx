import "./Glasspane.css"
import {FC, useContext, useState} from "react";
import {BasicGlasspanePropI, closeOnClickOutside} from "./GlasspaneUtils.ts";
import {ViewableElement} from "../../util/interfaces.ts";
import {UserContext} from "../../App.tsx";
import BtnTitle from "../title/BtnTitle.tsx";

interface ReviewGlasspanePropI extends  BasicGlasspanePropI{
    ofBook: string;
}

const GlasspaneReviews : FC<ReviewGlasspanePropI> = ({closeHandler, confirmHandler, ofBook}) => {
    const [title, setTitle] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const user = useContext(UserContext);

    const review : ViewableElement = {
        key: -2,
        name: title,
        subtext: comment,
        sqlData: {
            username: user,
            book: ofBook,
            commenttitle: title,
            commenttext: comment
        } as never
    };

    return (
        <div className={"glassPane"} onClick={(e) => closeOnClickOutside(closeHandler, e)}>
            <div className={"inputForm wrapper-card"}>
                <BtnTitle title={"Add a review to '" + ofBook + "'"} disabled={title === "" || comment === ""}
                          topBtnName={"Confirm"} onTopBtnClick={() => confirmHandler(review)} style={{gridArea: "h"}}/>

                <span>
                    <label style={{gridArea: "a"}}> Titolo Commento </label>
                </span>
                <input style={{gridArea: "b"}} onChange={(e) => setTitle(e.target.value)} value={title} maxLength={30}/>
                <span>
                    <label style={{gridArea: "c"}}> Commento Testo </label>
                </span>
                <textarea style={{gridArea: "d"}} onChange={(e) => setComment(e.target.value)} value={comment} maxLength={500}/>
            </div>
        </div>
    );
}

export default GlasspaneReviews;
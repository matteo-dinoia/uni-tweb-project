import "./StarRating.css";
import {FC} from "react";

interface StarRatingPropI{
    star: number,
    setStar?: (star: number) => void;
}

const BtnTitle: FC<StarRatingPropI> = ({star, setStar}) => {

    return (
        <div>
            { /* Icon by https://icons8.com */
                Array.from({ length: 10 }).map(
                    (_el, index) => <button key={index}
                            className={"star "} disabled={setStar === undefined}
                            onClick={setStar === undefined ? () => {} : () => setStar(index + 1)}
                    >
                        <img src={index + 1 <= star ? "/full-star.png" : "/star.png"} alt={"star"}/>
                    </button>
                )
            }
        </div>
    );
}

export default BtnTitle;
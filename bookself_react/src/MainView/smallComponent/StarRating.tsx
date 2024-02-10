import "./StarRating.css";
import {FC} from "react";

interface StarRatingPropI{
    star: number,
    setStar?: (star: number) => void;
}

const BtnTitle: FC<StarRatingPropI> = ({star, setStar}) => {

    return (
        <div>
            {
                Array.from({ length: 10 }).map(
                    (_el, index) => <button key={index}
                                            className={"star " + (index + 1 <= star ? "fullStar": "")}
                                            disabled={setStar === undefined}
                                            onClick={setStar === undefined ? () => {} : () => setStar(index + 1)}
                                    />
                )
            }
        </div>
    );
}

export default BtnTitle;
import {CSSProperties, FC} from "react";
import "./BtnTitle.css";

interface CardPropI{
    title: string;
    topBtnName?: string;
    onTopBtnClick?: (() => void);
    disabled?: boolean;
    style?: CSSProperties;
}

const BtnTitle: FC<CardPropI> = ({title, topBtnName, onTopBtnClick, disabled, style}) => {

    const hasBtn = topBtnName !== undefined && onTopBtnClick !== undefined

    return (
        <div className={"titleCard"} style={style}>
            <h2>{title}</h2>
            {!hasBtn ? "" :
                <button onClick={onTopBtnClick} disabled={disabled}>{topBtnName}</button>
            }
        </div>
    );
}

export default BtnTitle;
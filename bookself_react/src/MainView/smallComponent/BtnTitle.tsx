import {CSSProperties, FC} from "react";
import "./BtnTitle.css";

interface BtnTitlePropI{
    title: string;
    topBtnName?: string;
    onTopBtnClick?: (() => void);
    disabled?: boolean;
    style?: CSSProperties;
}

const BtnTitle: FC<BtnTitlePropI> = ({title, topBtnName, onTopBtnClick, disabled, style}) => {

    const hasBtn = topBtnName !== undefined && onTopBtnClick !== undefined

    return (
        <div className={"titleCard"} style={style}>
            <h3>{title}</h3>
            {!hasBtn ? "" :
                <button onClick={onTopBtnClick} disabled={disabled}>{topBtnName}</button>
            }
        </div>
    );
}

export default BtnTitle;
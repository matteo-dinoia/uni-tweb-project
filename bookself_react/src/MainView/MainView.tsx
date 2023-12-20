import "./MainView.css"
import {FC} from "react";
import Card from "./List/Card.tsx";
import RightView from "./RightView.tsx";

const MainView : FC = () => {
    const friends = ["You", "Other 1", "Other 2", "Other 3", "Other 4", "Other 5"];

    return (
        <div className={"mainview"}>

            <Card title={"Friends"} className={"friends"} array={friends} changeSelection={(index) => void index}/>
            <RightView/>
            {/*<GlassPane/>*/}
        </div>
    );
}

export default MainView;
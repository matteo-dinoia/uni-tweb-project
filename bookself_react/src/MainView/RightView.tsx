import {FC} from "react";
import Card from "./List/Card.tsx";

const RightView: FC = () => {
    const books = ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"];
    const similars = ["Similar Book 1", "Similar Book 2", "Similar Book 3", "Similar Book 4", "Similar Book 5"];

    return (
        <>
            <Card title={"Books of friend ..."} className={"books"} array={books} changeSelection={(index) => void index}/>
            <Card title={"Similar books of book ..."} className={"similars"} array={similars} changeSelection={(index) => void index}/>
        </>
    );
}

export default RightView;
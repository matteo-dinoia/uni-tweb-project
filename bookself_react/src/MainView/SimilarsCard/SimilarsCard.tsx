import "./SimilarsCard.css"
import List from "../../List/List.tsx";

function SimilarsCard() {
    return (
        <div className={"similars"} style={{gridArea: "c"}}>

            <div className={"titleCard"}>
                <h2>Similar books of book:...</h2>
                <button>Add</button>
            </div>

            <List array={["Similar Book 1", "Similar Book 2", "Similar Book 3", "Similar Book 4", "Similar Book 5"]}/>
        </div>
    );
}

export default SimilarsCard;
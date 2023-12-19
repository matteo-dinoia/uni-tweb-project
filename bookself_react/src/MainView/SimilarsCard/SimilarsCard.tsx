import "./SimilarsCard.css"
import ListElement from "../ListElement/ListElement.tsx";

function SimilarsCard() {
    return (
        <div className={"similars"} style={{gridArea: "c"}}>

            <div className={"titleCard"}>
                <h2>Similar books of book:...</h2>
                <button>Add</button>
            </div>

            <ul>
                <ListElement name={"Similar Book 1"} selected={false}/>
                <ListElement name={"Similar Book 2 Mine"} selected={false}/>
                <ListElement name={"Similar Book 3"} selected={true}/>
                <ListElement name={"Similar Book 4"} selected={false}/>
                <ListElement name={"Similar Book 5"} selected={false}/>
                <ListElement name={"Similar Book 6"} selected={false}/>
                <ListElement name={"Similar Book 7"} selected={false}/>
                <ListElement name={"Similar Book 8"} selected={false}/>
                <ListElement name={"Similar Book 9"} selected={false}/>
            </ul>
        </div>
    );
}

export default SimilarsCard;
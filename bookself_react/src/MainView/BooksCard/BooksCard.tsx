import "./BooksCard.css"
import ListElement from "../ListElement/ListElement.tsx";

function BooksCard() {
    return (
        <div className={"books"} style={{gridArea: "b"}}>

            <div className={"titleCard"}>
                <h2>Books of friend: ...</h2>
                <button>Add</button>
            </div>

            <ul>
                <ListElement name={"Book 1"}  selected={false}/>
                <ListElement name={"Book 2"}  selected={false}/>
                <ListElement name={"Book 3"}  selected={false}/>
                <ListElement name={"Book 4"}  selected={false}/>
                <ListElement name={"Book 5"}  selected={false}/>
                <ListElement name={"Book 6"}  selected={true}/>
                <ListElement name={"Book 7"}  selected={false}/>
                <ListElement name={"Book 8"}  selected={false}/>
                <ListElement name={"Book 9"}  selected={false}/>
                <ListElement name={"Book 11"}  selected={false}/>
                <ListElement name={"Book 12"}  selected={false}/>
                <ListElement name={"Book 13"}  selected={false}/>
                <ListElement name={"Book 14"}  selected={false}/>
                <ListElement name={"Book 15"}  selected={false}/>
                <ListElement name={"Book 16"}  selected={false}/>
                <ListElement name={"Book 17"}  selected={false}/>
                <ListElement name={"Book 18"}  selected={false}/>
                <ListElement name={"Book 19"}  selected={false}/>
            </ul>
        </div>
    );
}

export default BooksCard;
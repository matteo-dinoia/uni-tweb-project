import "./BooksCard.css"
import List from "../../List/List.tsx";

function BooksCard() {
    return (
        <div className={"books"} style={{gridArea: "b"}}>

            <div className={"titleCard"}>
                <h2>Books of friend: ...</h2>
                <button>Add</button>
            </div>

            <List array={["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"]}/>
        </div>
    );
}

export default BooksCard;
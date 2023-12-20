import "./FriendsCard.css"
import List from "../../List/List.tsx";

function FriendsCard() {
    return (
        <div className={"friends"} style={{gridArea: "a"}}>

            <div className={"titleCard"}>
                <h2>Friends</h2>
                <button>Add</button>
            </div>

            <List array={["You", "Other 1", "Other 2", "Other 3", "Other 4", "Other 5"]}/>
        </div>
    );
}

export default FriendsCard;
import "./FriendsCard.css"
import ListElement from "../ListElement/ListElement.tsx";

function FriendsCard() {
    return (
        <div className={"friends"} style={{gridArea: "a"}}>

            <div className={"titleCard"}>
                <h2>Friends</h2>
                <button>Add</button>
            </div>

            <ul>
                <ListElement name={"You"} selected={false}/>
                <ListElement name={"Other 1"} selected={false}/>
                <ListElement name={"Other 2"} selected={true}/>
                <ListElement name={"Other 3"} selected={false}/>
                <ListElement name={"Other 4"} selected={false}/>
            </ul>
        </div>
    );
}

export default FriendsCard;
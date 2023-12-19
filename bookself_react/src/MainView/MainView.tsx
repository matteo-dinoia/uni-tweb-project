import "./MainView.css"
import FriendsCard from "./FriendsCard/FriendsCard.tsx";
import BooksCard from "./BooksCard/BooksCard.tsx";
import SimilarsCard from "./SimilarsCard/SimilarsCard.tsx";

function MainView() {
    return (
        <div className={"mainview"}>
            <FriendsCard/>
            <BooksCard/>
            <SimilarsCard/>
            {/*<GlassPane/>*/}
        </div>
    );
}

export default MainView;
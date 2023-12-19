import "./GlassPane.css"

function GlassPane() {
    return (
        <div className={"glassPane"}>
            <div className={"inputForm"}>
                <span>
                    <label style={{gridArea: "a"}}> Nome Libro </label>
                </span>
                <input style={{gridArea: "b"}}></input>
                <span>
                    <label style={{gridArea: "c"}}> Trama </label>
                </span>
                <input style={{gridArea: "d"}}></input>
                <span>
                    <label style={{gridArea: "e"}}> Tags </label>
                </span>
                <input style={{gridArea: "f"}}></input>
                <div className={"addImage"} style={{gridArea: "g"}}>
                    <span>Add image</span>
                </div>
                <button style={{gridArea: "h"}}>Cancel</button>
                <button style={{gridArea: "i"}}>Add</button>
            </div>
        </div>
    );
}

export default GlassPane;
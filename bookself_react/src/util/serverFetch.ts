import {ViewableElement} from "./interfaces.ts";

const serverPath : string = "http://localhost:8080/bookself/";

export function serverFetch (page: string, methodName: string, bodyObj? : object){
    let bodyStr = undefined;
    if(bodyObj !== undefined)
        bodyStr = JSON.stringify(bodyObj);

    return fetch(serverPath + page, {
            method: methodName,
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
            body: bodyStr
        }).then(data =>{
            if(!data.ok)
                return {error: "Status code: " + data.status + " " + data.statusText};
            return data.json();
        }).then(json => {
            if(json["error"] !== undefined){
                console.log("ERROR (in request to " + page + "): " + json["error"]);
                return [];
            }
            return json["value"];
        }).catch((reason) => ({error: "Coundn't connect to server \n" + reason}))
}

export function serverGet (page: string, arrayToViewableArray: (array : never[]) => ViewableElement[], setElements: (elements : ViewableElement[]) => void): () => void {
    console.log("Fetching from \"" + page + "\"");
    let ignore : boolean = false;

    serverFetch(page, "get")
        .then((array: never[]) => arrayToViewableArray(array))
        .then((viewableArray: ViewableElement[]) => {
            if(!ignore) setElements(viewableArray);
        });

    return () => {ignore = true;}
}
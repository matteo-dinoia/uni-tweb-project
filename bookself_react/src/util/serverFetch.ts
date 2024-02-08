import {ViewableElement} from "./interfaces.ts";

const serverPath : string = "http://localhost:8080/bookself/";

export function serverFetchJson (page: string, methodName: string, bodyObj? : object){
    const bodyStr = bodyObj !== undefined ? JSON.stringify(bodyObj) : undefined;

    return fetch(serverPath + page, {
            method: methodName,
            credentials: 'include',
            headers: { 'Accept': 'application/json' },
            body: bodyStr
        }).then(data =>{
            if(!data.ok)
                throw new Error("Status code: " + data.status + " " + data.statusText);
            return data.json();
        }).then(json => {
            if(json["error"] !== undefined)
                throw new Error(json["error"])
            else if(json["value"] !== undefined)
                return json["value"];
            return new Error("Invalid type of response");
        });
}

export function serverGetList (page: string, arrayToViewableArray: (array : never[]) => ViewableElement[], setElements: (elements : ViewableElement[]) => void): () => void {
    let ignore : boolean = false;

    serverFetchJson(page, "get")
        .catch(() => [])
        .then((array: never[]) => arrayToViewableArray(array))
        .then((viewableArray: ViewableElement[]) => {
            if(!ignore) setElements(viewableArray);
        });

    return () => {ignore = true;}
}
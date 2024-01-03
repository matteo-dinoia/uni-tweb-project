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
        }).then(data => data.json())
        .catch((reason) => ({error: "Coundn't connect to server \n" + reason}))
}

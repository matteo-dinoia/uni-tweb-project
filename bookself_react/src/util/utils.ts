
export function groupBy<T>(list: T[], callback: (element: T) => string): T[][]{
    const res = {} as T[][];
    list.map(element => {
        const group = callback(element);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if(res[group] == undefined)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            res[group] = [element];
        else
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            res[group].push(element);
    })
    return res;
}
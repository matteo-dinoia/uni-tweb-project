
export function groupBy<T>(list: T[], callback: (element: T) => string): T[][]{
    const res = new Map<string, T[]>();
    list.forEach(element => {
        const groupKey = callback(element);
        const list = res.get(groupKey);

        if(!list)
            res.set(groupKey, [element])
        else
            list.push(element);
    });

    return [...res.values()];
}
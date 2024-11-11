export {}
declare global {
    export interface Array<T> {
        groupBy<K extends keyof any>(func: (x: T) => K): Record<K, T[]>;
        countGroups<K extends keyof any>(func: (x: T) => K): Record<K, number>;
    }
}

Array.prototype.groupBy = function <T, K extends keyof any>(getKey: (x: T) => K) {
    return this.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) {
            previous[group] = [];
        }
        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, T[]>);
}

Array.prototype.countGroups = function <T, K extends keyof any>(getKey: (x: T) => K) {
    return this.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) {
            previous[group] = 0;
        }
        previous[group]++;
        return previous;
    }, {} as Record<K, T[]>);
}

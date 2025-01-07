export function memoize<Args extends unknown[], Result>(
    func: (...args: Args) => Result,
    generateKey?: (...args: Args) => string,
): (...args: Args) => Result {
    const stored = new Map<string, Result>();

    return (...args) => {
        let k;
        if (generateKey) {
            k = generateKey(...args);
        } else {
            k = JSON.stringify(args);
        }

        if (stored.has(k)) {
            return stored.get(k)!;
        }
        const result = func(...args);
        stored.set(k, result);
        // console.log(stored.size);
        return result;
    };
}

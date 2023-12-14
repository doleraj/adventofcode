export function memoize<Args extends unknown[], Result>(
    func: (...args: Args) => Result,
): (...args: Args) => Result {
    const stored = new Map<string, Result>();

    return (...args) => {
        const k = JSON.stringify(args);
        if (stored.has(k)) {
            return stored.get(k)!;
        }
        const result = func(...args);
        stored.set(k, result);
        return result;
    };
}

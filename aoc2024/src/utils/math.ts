export const gcd = (a: number, b: number): number => {
    return !b ? a : gcd(b, a % b);
}

export const gcdArray = (numbers: number[]) => {
    let result = numbers[0];
    for (let i = 0; i < numbers.length; i++) {
        result = gcd(numbers[i], result);

        if (result == 1) {
            return 1;
        }
    }
}

export const lcm = (a: number, b: number) => {
    return (a * b) / gcd(a, b);
}

export const lcmArray = (numbers: number[]) => {
    return numbers.reduce(lcm, 1);
}

export const manhattanDistance = (location: number[], end: { 0: number, 1: number }): number => {
    return Math.abs(location[0] - end[0]) + Math.abs(location[1] - end[1]);
}

export const manhattanDistanceCoord = (location: { y: number, x: number }, end: { y: number, x: number }): number => {
    return Math.abs(location.y - end.y) + Math.abs(location.x - end.x);
}

export const doActualModNotFakeAlmostCorrectMod = (num: number, mod: number) => {
    return ((num % mod) + mod) % mod;
};


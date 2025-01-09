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

export const doActualModNotFakeAlmostCorrectMod = <T extends bigint|number>(num: T, mod: T): T => {
    if (typeof num === "bigint" && typeof mod === "bigint") {
        return ((num % mod) + mod) % mod as T;
    } else if (typeof num === "number" && typeof mod === "number") {
        return ((num % mod) + mod) % mod as T;
    }
    throw new Error("Mixed number types, doofus.")
};

export const extendedGcd = (a: bigint, b: bigint) => {
    let oldR = a;
    let r = b;
    let oldS = 1n;
    let s = 0n;
    let oldT = 0n;
    let t = 1n;

    while (r !== 0n) {
        const quotient = oldR / r;
        // console.log(quotient);
        let temp = oldR;
        oldR = r;
        r = temp - quotient * r;
        temp = oldS;
        oldS = s;
        s = temp - quotient * s;
        temp = oldT;
        oldT = t;
        t = temp - quotient * t;
        // console.log(`After round ${round++}: r ${r}, oldR ${oldR} s ${s} oldS ${oldS} t ${t} oldT ${oldT}`);
    }

    return { bezout: [oldS, oldT], gcd: oldR, gdcQuotients: [t, s] }
}

export const chineseRemainderTheorem = (moduli: bigint[], remainders: bigint[]) => {
    const product : bigint = moduli.reduce((acc: bigint, val) => acc * val, 1n);

    return moduli.reduce((sum, modulus, index) => {
        // Find the modular multiplicative inverse and calculate the sum
        const localProduct = product / modulus;
        return sum + localProduct * doActualModNotFakeAlmostCorrectMod(remainders[index] * extendedGcd(localProduct, modulus).bezout[0], moduli[index]);
    }, 0n) % product;
}

export const permute = <T>(base: T[]) => {
    const result = [base.slice()];
    const current = new Array(base.length).fill(0);

    let i = 1;
    while (i < base.length) {
        if (current[i] < i) {
            const k = i % 2 && current[i];
            const p = base[i];
            base[i] = base[k];
            base[k] = p;

            ++current[i];
            i = 1;
            result.push(base.slice());
        } else {
            current[i] = 0;
            ++i;
        }
    }

    return result;
}


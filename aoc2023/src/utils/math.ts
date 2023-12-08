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



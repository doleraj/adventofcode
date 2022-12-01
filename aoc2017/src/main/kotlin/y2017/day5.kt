package y2017

fun day5(input: Array<Int>): Int {

    var index = 0
    var steps = 0

    while(index < input.size) {
        index += input[index]++
        steps++
    }

    return steps
}

fun day5Second(input: Array<Int>): Int {

    var index = 0
    var steps = 0

    while(index < input.size) {
        val pointer = input[index]
        input[index] = if (pointer >= 3) pointer - 1 else pointer + 1
        index += pointer
        steps++
    }

    return steps
}
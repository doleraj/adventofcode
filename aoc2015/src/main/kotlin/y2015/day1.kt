package y2015

fun day1(input: String): Int {
    return input.map { c -> if (c == '(') { 1 } else { -1 }}.sum()
}

fun day1Second(input: String): Int {
    var negativeIndex = 1
    var total = 0
    var index = 1
    input.map { c -> if (c == '(') { 1 } else { -1 }}.forEach { it -> total += it; if (total < 0 && negativeIndex == 1) { negativeIndex = index }; index++ }

    return negativeIndex
}

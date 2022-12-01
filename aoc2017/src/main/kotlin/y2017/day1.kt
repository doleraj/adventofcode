package y2017

fun day1(input: String): Int {
    var total = 0

    for (i in input.indices) {
        val newIndex = (i + 1) % input.length
        if (input[i] == input[newIndex]) {
            total += input[i].toString().toInt()
        }
    }

    return total
}

fun day1Second(input: String): Int {
    var total = 0
    val getNewIndex = generateNewIndexFun(input.length)

    for (i in input.indices) {
        val newIndex = getNewIndex(i)
        if (input[i] == input[newIndex]) {
            total += input[i].toString().toInt()
        }
    }

    return total
}

fun generateNewIndexFun(length: Int): (Int) -> Int {
    val halfLength = length / 2
    return { index -> (index + halfLength) % length }
}
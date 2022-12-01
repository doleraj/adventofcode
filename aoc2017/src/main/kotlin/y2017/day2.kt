package y2017

fun checksum(input: Array<Array<Int>>): Int {
    return input.map { row -> maxRowDifference(row) }.reduce { total, rowTotal -> total + rowTotal }
}

fun maxRowDifference(row: Array<Int>): Int {
    val max = row.maxBy { it }!!
    val min = row.filter { it >= 0 }.minBy { it }!!
    return max - min
}

fun evenlyDivisibleChecksum(input: Array<Array<Int>>): Int {
    return input.map { row -> findEvenDivision(row) }.reduce { total, rowTotal -> total + rowTotal }
}

fun findEvenDivision(row: Array<Int>): Int {
    for (number in row) {
        for (otherNumber in row) {
            if (number == otherNumber) {
                continue
            }

            if (number.rem(otherNumber) == 0) {
                return number / otherNumber
            }
        }
    }
    return -1
}
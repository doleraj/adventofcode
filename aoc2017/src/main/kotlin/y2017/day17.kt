package y2017

fun day17(stepSize: Int): Int {
    val buffer = mutableListOf(0)
    var listSize = 1
    var currentPosition = 0
    while (listSize < 2018) {
        currentPosition = findNextPosition(currentPosition, stepSize, listSize)
        buffer.add(currentPosition, listSize++)
    }

    return buffer[buffer.indexOf(2017) + 1]
}

fun day17Second(stepSize: Int): Int {
    var listSize = 1
    var currentPosition = 0
    var saved = 0
    while (listSize != 50000000) {
        currentPosition = findNextPosition(currentPosition, stepSize, listSize)
        if (currentPosition == 1) {
            saved = listSize
        }
        listSize++
    }

    return saved
}

fun findNextPosition(currentPosition: Int, stepSize: Int, listSize: Int): Int {
    return (currentPosition + stepSize) % listSize + 1
}
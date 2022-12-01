package y2017

fun day10(numList: MutableList<Int>, lengths: List<Int>): Int {
    var currentPos = 0
    var skipSize = 0

    for (length in lengths) {
        reverse(numList, currentPos, length)
        currentPos = (currentPos + length + skipSize) % numList.size
        skipSize++
    }

    return numList[0] * numList[1]
}

fun day10Second(input: String): String {
    return knotHash(input)
}

fun knotHash(input: String): String {
    val intLengths = mutableListOf<Int>()

    for (char in input) {
        intLengths.add(char.toInt())
    }
    intLengths.addAll(listOf(17, 31, 73, 47, 23))

    val numList = (0..255).toMutableList()
    var currentPos = 0
    var skipSize = 0
    var repeatCount = 64

    while (repeatCount > 0) {
        for (length in intLengths) {
            reverse(numList, currentPos, length)
            currentPos = (currentPos + length + skipSize) % numList.size
            skipSize++
        }
        repeatCount--
    }

    val denseHash = mutableListOf<Int>()
    var hashCount = 0
    while (hashCount < 256) {
        denseHash.add(numList[hashCount] xor numList[hashCount + 1] xor numList[hashCount + 2] xor numList[hashCount + 3] xor
                numList[hashCount + 4] xor numList[hashCount + 5] xor numList[hashCount + 6] xor numList[hashCount + 7] xor
                numList[hashCount + 8] xor numList[hashCount + 9] xor numList[hashCount + 10] xor numList[hashCount + 11] xor
                numList[hashCount + 12] xor numList[hashCount + 13] xor numList[hashCount + 14] xor numList[hashCount + 15])
        hashCount += 16
    }

    var hash = ""
    for (num in denseHash) {
        hash += "%02X".format(num).toLowerCase()
    }
    return hash
}

fun reverse(numList: MutableList<Int>, currentPos: Int, length: Int) {
    var index = currentPos
    var lengthLeft = length
    val sublist = mutableListOf<Int>()
    while (lengthLeft > 0) {
        sublist.add(numList[index])
        index = (index + 1) % numList.size
        lengthLeft--
    }

    sublist.reverse()
    var subListIndex = sublist.size - 1
    index--
    if (index < 0) index += numList.size

    while (lengthLeft < length) {
        numList[index] = sublist[subListIndex]
        subListIndex--
        index = (index - 1) % numList.size
        if (index < 0) index += numList.size
        lengthLeft++
    }
}
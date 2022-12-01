package y2017

fun day16(input: List<CharArray>, initial: Int): String {
    val programArray = arrayOf('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p').sliceArray(0..(initial - 1)).toCharArray()
    dance(programArray, input)
    return programArray.joinToString("")
}

fun day16Second(input: List<CharArray>, initial: Int, danceCount: Int): String {
    val programArray = arrayOf('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p').sliceArray(0..(initial - 1)).toCharArray()

    val visitedStates = mutableListOf(programArray.joinToString(""))

    var i = danceCount  % 42 // FFFFFFFFFFFFF
    var repeatStart = 0
    var repeatCount = 0
    val iteration = 10000
    var time = System.currentTimeMillis()
    while (i > 0) {
        dance(programArray, input)
        if (visitedStates[repeatCount] == programArray.joinToString("")) {
            repeatCount++
            if (repeatStart == 0) {
                repeatStart = danceCount - i
            }
            if (repeatCount == 50) {
                println(visitedStates)
                println(repeatStart)
                break
            }
        } else {
            repeatCount = 0
        }


        visitedStates.add(programArray.joinToString(""))
        i--
        if (i % iteration == 0) {
            val new = System.currentTimeMillis()
            val delta = new - time
            val seconds = delta / 1000
            if (seconds > 0) {
                val ratePerMinute = (iteration / seconds) * 60
                val totalTime = danceCount / ratePerMinute
                time = new
                println("$i - $seconds means $ratePerMinute per minute, for $totalTime total minutes")
            }
        }
    }
    return programArray.joinToString("")
}

fun dance(positions: CharArray, moves: List<CharArray>) {
    var index = 0
    val movesSize = moves.size
    while (index != movesSize) {
        val move = moves[index++]
        when (move[0]) {
            's' -> spin(move, positions)
            'x' -> exchange(move, positions)
            'p' -> partner(move, positions)
        }
    }
}

fun spin(move: CharArray, places: CharArray) {
    val moveSize = if (move.size == 2) {
        Character.getNumericValue(move[1])
    } else {
        ("" + move[1] + move[2]).toInt()
    }

    val remainingChars = places.size - moveSize
    val out = places.sliceArray(remainingChars..(places.size - 1))
    val tmp = places.sliceArray(0..(remainingChars - 1))
    System.arraycopy(out, 0, places, 0, out.size)
    System.arraycopy(tmp, 0, places, out.size, tmp.size)
}

fun exchange(move: CharArray, places: CharArray) {
    val index1: Int
    val index2: Int
    val nextIndex: Int
    if (move[2] == '/') {
        index1 = move[1] - '0'
        nextIndex = 3
    } else {
        index1 = ("" + move[1] + move[2]).toInt()
        nextIndex = 4
    }

    index2 = if (nextIndex + 1 == move.size) {
        move[nextIndex] - '0'
    } else {
        ("" + move[nextIndex] + move[nextIndex + 1]).toInt()
    }

    val tmp = places[index1]
    places[index1] = places[index2]
    places[index2] = tmp
}

fun partner(move: CharArray, places: CharArray) {
    val index1 = places.indexOf(move[1])
    val index2 = places.indexOf(move[3])

    val tmp = places[index1]
    places[index1] = places[index2]
    places[index2] = tmp
}
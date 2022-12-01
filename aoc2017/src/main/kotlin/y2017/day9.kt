package y2017

fun day9(input:String): Triple<Int, Int, Int> {
    var index = 0
    var groups = 0
    var currentScore = 0
    var totalScore = 0
    var totalGarbage = 0
    while (index < input.length) {
        if (input[index] == '<') {
            val garbageResult = parseGarbage(input, index)
            index = garbageResult.first
            totalGarbage += garbageResult.second
        }

        if (input[index] == '{') {
            groups++
            currentScore++
        } else if (input[index] == '}') {
            totalScore += currentScore
            currentScore--
        }

        index++
    }
    return Triple(groups, totalScore, totalGarbage)
}

fun parseGarbage(input: String, startIndex: Int): Pair<Int, Int> {
    if (input[startIndex] != '<') {
        return Pair(startIndex, 0)
    }

    var garbageCount = 0
    var index = startIndex + 1
    while (input[index] != '>') {
        if (input[index] == '!') {
            index += 2
        } else {
            garbageCount++
            index++
        }
    }
    return Pair(index, garbageCount)
}
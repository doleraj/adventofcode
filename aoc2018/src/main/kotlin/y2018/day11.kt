package y2018

fun day11(serialNumber: Int): Pair<Int, Int> {
    val grid = List(300) { y -> List(300) { x ->  getPowerLevelForCell(Pair(x, y), serialNumber) } }
    val miniGridList = mutableListOf<Pair<Pair<Int, Int>, Int>>()

    val max = 297
    (0..max).map { y ->
        (0..max).map { x ->
            miniGridList.add(Pair(Pair(x, y), grid.slice(y..y + 2).map { xList -> xList.slice(x..x + 2).sum() }.sum()))
        }
    }

    return miniGridList.sortedByDescending { miniGrid -> miniGrid.second }.first().first
}
fun day11Second(serialNumber: Int): Triple<Int, Int, Int> {
    val partialSumGrid = List(301) { MutableList(301) { 0 } }

    (1..300).map { y ->
        (1..300).map { x ->
            val power = getPowerLevelForCell(Pair(x, y), serialNumber)
            val powerLevelForYMinus1 = partialSumGrid[y - 1][x]
            val powerLevelForXMinus1 = partialSumGrid[y][x - 1]
            val powerLevelForXAndYMinus1 = partialSumGrid[y - 1][x - 1]
            partialSumGrid[y][x] = power + powerLevelForYMinus1 + powerLevelForXMinus1 - powerLevelForXAndYMinus1
        }
    }

    var bestGrid = Pair(Triple(0, 0, 0), Int.MIN_VALUE)
    (1..300).map { gridSize ->
        (gridSize..300).map { y ->
            (gridSize..300).map { x ->
                val D = partialSumGrid[y][x]
                val B = partialSumGrid[y - gridSize][x]
                val C = partialSumGrid[y][x - gridSize]
                val A = partialSumGrid[y - gridSize][x - gridSize]
                val sum = D - B - C + A
                if (sum > bestGrid.second) {
                    System.out.println("New best $x $y $gridSize $sum")
                    bestGrid = Pair(Triple(x - gridSize + 1, y - gridSize + 1, gridSize), sum)
                }
            }
        }
    }

    return bestGrid.first
}

fun getPowerLevelForCell(coords: Pair<Int, Int>, serialNumber: Int): Int {
    val rackId = coords.first + 10
    return (rackId * coords.second + serialNumber) * rackId / 100 % 10 - 5
}

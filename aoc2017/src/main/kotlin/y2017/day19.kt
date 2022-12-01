package y2017

fun day19(input: List<String>): List<Any> {
    val grid = parseMap(input)

    var letterCollector = ""
    var steps = 1
    val x = grid[0].indexOf('|')
    var lastPosition = getPositionFromGrid(x, 0, grid)
    var currentPosition: Position = getPositionFromGrid(x, 1, grid)
    while (currentPosition.symbol != ' ') {
        val pos = makeNextGridMove(lastPosition, currentPosition, grid)
        lastPosition = currentPosition
        currentPosition = pos
        if (pos.symbol != ' ' && pos.symbol != '|' && pos.symbol != '-' && pos.symbol != '+') {
            letterCollector += pos.symbol
        }
        steps++
    }

    return listOf(letterCollector, steps)
}

fun parseMap(input: List<String>): List<List<Char>> {
    val maxLen = input.maxBy({ line -> line.length })!!.length
    return input.map({line -> line.padEnd(maxLen, ' ').toCharArray().asList()})
}

fun makeNextGridMove(lastPosition: Position, currentPosition: Position, grid: List<List<Char>>): Position {
//    println("(" + currentPosition.x + "," + currentPosition.y + ") " + currentPosition.symbol)
    return when (currentPosition.symbol) {
        '+' -> findNextPositionForCorner(lastPosition, currentPosition, grid)
        ' ' -> throw Exception("EVERYTHING IS WRONG")
        else -> findNextPositionForStraightaway(lastPosition, currentPosition, grid)
    }
}

fun findNextPositionForStraightaway(lastPosition: Position, currentPosition: Position, grid: List<List<Char>>): Position {
    val xDelta = currentPosition.x - lastPosition.x
    val yDelta = currentPosition.y - lastPosition.y

    if (yDelta != 0) {
        return getPositionFromGrid(currentPosition.x, currentPosition.y + yDelta, grid)
    }

    if (xDelta != 0) {
        return getPositionFromGrid(currentPosition.x + xDelta, currentPosition.y, grid)
    }
    throw Exception("BADNESS")
}

fun findNextPositionForCorner(lastPosition: Position, currentPosition: Position, grid: List<List<Char>>): Position {
    val xDelta = currentPosition.x - lastPosition.x
    val yDelta = currentPosition.y - lastPosition.y

    if (yDelta != 0) {
        val xPlus = currentPosition.x + 1
        val xMinus = currentPosition.x - 1

        // find which side the x is on
        return if (xPlus < grid[currentPosition.y].size && grid[currentPosition.y][xPlus] != ' ') {
            getPositionFromGrid(xPlus, currentPosition.y, grid)
        } else if (xMinus > 0) {
            getPositionFromGrid(xMinus, currentPosition.y, grid)
        } else {
            return getPositionFromGrid(0, 0, grid)
        }
    }

    if (xDelta != 0) {
        val yPlus = currentPosition.y + 1
        val yMinus = currentPosition.y - 1

        // find which side the y is on
        return if (yPlus < grid.size && grid[yPlus][currentPosition.x] != ' ') {
            getPositionFromGrid(currentPosition.x, yPlus, grid)
        } else if (yMinus > 0) {
            getPositionFromGrid(currentPosition.x, yMinus, grid)
        } else {
            return getPositionFromGrid(0, 0, grid)
        }
    }

    throw Exception("BADNESS")
}

fun getPositionFromGrid(x: Int, y: Int, grid: List<List<Char>>): Position {
    return Position(x, y, grid[y][x])
}

data class Position (val x: Int, val y: Int, val symbol: Char)
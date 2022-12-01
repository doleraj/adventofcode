package y2015

fun day3(input: String): Int {
    val grid = mutableMapOf<Pair<Int, Int>, Int>()
    var currentLocation = Pair(0, 0)

    grid[currentLocation] = 1 + (grid[currentLocation] ?: 0)
    for (direction in input.split("")) {
        when (direction) {
            "^" -> currentLocation = Pair(currentLocation.first, currentLocation.second - 1)
            "v" -> currentLocation = Pair(currentLocation.first, currentLocation.second + 1)
            ">" -> currentLocation = Pair(currentLocation.first + 1, currentLocation.second)
            "<" -> currentLocation = Pair(currentLocation.first - 1, currentLocation.second)
        }
        grid[currentLocation] = 1 + (grid[currentLocation] ?: 0)
    }

    return grid.filter { entry -> entry.value > 0 }.size
}

fun day3Second(input: String): Int {
    val grid = mutableMapOf<Pair<Int, Int>, Int>()
    val locations = mutableMapOf(Pair("S", Pair(0, 0)), Pair("R", Pair(0, 0)))

    grid[locations["S"]!!] = 1 + (grid[locations["S"]!!] ?: 0)
    for ((index, direction) in input.withIndex()) {
        val currentActor = if (index % 2 == 0) { "S" } else { "R" }
        val currentLocation = locations[currentActor]!!
        when (direction) {
            '^' -> locations[currentActor] = Pair(currentLocation.first, currentLocation.second - 1)
            'v' -> locations[currentActor] = Pair(currentLocation.first, currentLocation.second + 1)
            '>' -> locations[currentActor] = Pair(currentLocation.first + 1, currentLocation.second)
            '<' -> locations[currentActor] = Pair(currentLocation.first - 1, currentLocation.second)
        }
        grid[locations[currentActor]!!] = 1 + (grid[locations[currentActor]!!] ?: 0)
    }


    return grid.filter { entry -> entry.value > 0 }.size
}

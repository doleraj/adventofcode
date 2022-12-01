package y2018

fun day10(input: List<String>): Int {
    val regex = "position=<\\s*(-?\\d+),\\s*(-?\\d+)> velocity=<\\s*(-?\\d+),\\s*(-?\\d+)>".toRegex()
    val points = input
            .map { s -> regex.find(s)!! }
            .map { matchResult -> listOf(
                    matchResult.groups[1]!!.value.toInt(),
                    matchResult.groups[2]!!.value.toInt(),
                    matchResult.groups[3]!!.value.toInt(),
                    matchResult.groups[4]!!.value.toInt()
                ) }
            .map { list -> Point(Pair(list[0], list[1]), Pair(list[2], list[3])) }

    val grids = (0..20000)
            .map { index -> Pair(index, points.map { point -> point.tick() }) }

    printGrid(getGrid(grids).second)
    return 3
}

fun day10Second(input: List<String>): Int {
    val regex = "position=<\\s*(-?\\d+),\\s*(-?\\d+)> velocity=<\\s*(-?\\d+),\\s*(-?\\d+)>".toRegex()
    val points = input
            .map { s -> regex.find(s)!! }
            .map { matchResult -> listOf(
                    matchResult.groups[1]!!.value.toInt(),
                    matchResult.groups[2]!!.value.toInt(),
                    matchResult.groups[3]!!.value.toInt(),
                    matchResult.groups[4]!!.value.toInt()
            ) }
            .map { list -> Point(Pair(list[0], list[1]), Pair(list[2], list[3])) }

    val grids = (0..20000)
            .map { index -> Pair(index, points.map { point -> point.tick() }) }

    return getGrid(grids).first + 1
}


fun getGrid(grids: List<Pair<Int, List<Pair<Int, Int>>>>): Triple<Int, List<Pair<Int, Int>>, Int> {
    return grids
            .map { grid -> val maxes = getMaxXandYForGrid(grid.second); Triple(grid.first, grid.second, maxes.first + maxes.second) }
            .sortedBy { pair -> pair.third }.first()
}

fun getMaxXandYForGrid(grid: List<Pair<Int, Int>>): Pair<Int, Int> {
   return Pair((grid.map { t -> t.second }.max()!! - grid.map { t -> t.second }.min()!!) + 1,
               (grid.map { t -> t.first }.max()!! - grid.map { t -> t.first }.min()!!) + 1)
}

fun printGrid(grid: List<Pair<Int, Int>>) {
    val maxX = (grid.map { t -> t.second }.max()!! - grid.map { t -> t.second }.min()!!) + 1
    val minX = grid.map { t -> t.second }.min()!!
    val maxY = (grid.map { t -> t.first }.max()!! - grid.map { t -> t.first }.min()!!) + 1
    val minY = grid.map { t -> t.first }.min()!!
    System.out.println("$maxX $maxY")
    val printGrid = Array(maxX) { Array(maxY) { "_" } }

    System.out.println(printGrid)
    grid.forEach { t -> printGrid[t.second - minX][t.first - minY] = "#" }

    printGrid.forEach { strings -> System.out.println(strings.joinToString(", ")) }
}

class Point(var position: Pair<Int, Int>, val velocity: Pair<Int, Int>) {
    fun tick(): Pair<Int, Int> {
        position = Pair(position.first + velocity.first, position.second + velocity.second)
        return position
    }
}

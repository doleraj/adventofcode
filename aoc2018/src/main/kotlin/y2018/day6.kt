package y2018

fun day6(input: Array<String>): Int {
    val letters = ('A'..'Z').toMutableList()
    letters.addAll(listOf('?', '!', '*', '<', '>', '#', ';', ':', '/', '[', '|', ']', '(', ')', '{', '}', ',', '$', '%', '^', '&', '-', '=', '+'))
    val originalPoints = input
            .mapIndexed {index, s -> val coords = s.split(", "); TimePoint(Pair(coords[0].toInt(), coords[1].toInt()), letters[index].toString(), 0) }

    val points = (0..500).toList()
            .flatMap { i -> (0..500).map { j -> Pair(i, j) } }
            .map { newPoint ->
                val ownerDistancePairs = originalPoints
                        .map { timePoint -> Pair(timePoint.ownedBy, manhattanDistanceFrom(newPoint, timePoint.coords)) }
                        .sortedBy { ownerDistancePair -> ownerDistancePair.second }

                var owner = ownerDistancePairs[0].first //.toLowerCase()
                if (ownerDistancePairs[0].second == ownerDistancePairs[1].second) {
                    owner = "."
                }

                TimePoint(newPoint, owner, ownerDistancePairs[0].second)
            }

    return points
            .groupBy { t: TimePoint -> t.ownedBy.toUpperCase() }
            .filter { entry -> entry.value.filter {
                timePoint -> timePoint.coords.first == 0 ||
                    timePoint.coords.first == 500 ||
                    timePoint.coords.second == 0 ||
                    timePoint.coords.second == 500 }.isEmpty() }
            .map { entry -> Triple(entry.key, entry.value.map { timePoint -> timePoint.distanceToOwner }, entry.value.size) }
            .maxBy { triple -> triple.third }!!.third
}

fun manhattanDistanceFrom(first: Pair<Int, Int>, second: Pair<Int, Int>): Int {
    return Math.abs(first.first - second.first) + Math.abs(first.second - second.second)
}

fun day6Second(limitVal: Int, input: Array<String>): Int {
    val originalPoints = input
            .map { s -> val coords = s.split(", "); Pair(coords[0].toInt(), coords[1].toInt())}

    return (0..500).toList()
            .flatMap { i -> (0..500).map { j -> Pair(i, j) } }
            .map { newPoint ->
                val totalDistance = originalPoints
                        .map { originalPoint -> manhattanDistanceFrom(newPoint, originalPoint) }
                        .sum()

                val owner = if (totalDistance < limitVal) { "#" } else { "." }

                TimePoint(newPoint, owner, totalDistance)
            }
            .filter { timePoint -> timePoint.ownedBy == "#" }
            .size
}

fun printGrid(grid: Collection<TimePoint>) {
    val maxX = grid.map { t -> t.coords.second }.max()!! + 1
    val maxY = grid.map { t -> t.coords.first }.max()!! + 1
    val printGrid = Array(maxX) { Array(maxY) { "_" } }

    grid.forEach { t -> printGrid[t.coords.second][t.coords.first] = t.distanceToOwner.toString() }

    printGrid.forEach { strings -> System.out.println(strings.joinToString(", ")) }

}

class TimePoint(val coords: Pair<Int, Int>, val ownedBy: String, val distanceToOwner: Int) {
    override fun toString(): String {
        return "TimePoint($coords, $ownedBy, $distanceToOwner)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as TimePoint

        if (coords != other.coords) return false

        return true
    }

    override fun hashCode(): Int {
        return coords.hashCode()
    }


}

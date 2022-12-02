package y2018

import kotlin.math.abs

typealias Caves = Array<CharArray>
typealias Path = List<Point15>

class Day15(private val rawInput: List<String>) {
    private var caves: Caves = parseCaves()
    private var fighters: List<Fighter> = Fighter.findFighters(caves)

    private fun parseCaves(): Caves =
        rawInput.map { it.toCharArray() }.toTypedArray()

    private fun keepFighting(): Boolean =
        fighters.filterNot { it.dead }.distinctBy { it.team }.count() > 1
    
    private fun round(): Boolean {
        // Fighters need to be in order at the start of the round.
        // This is a sequence because we can lazily remove dead fighters before their turn,
        // otherwise we have to manually check.
        fighters.sorted().asSequence().filterNot { it.dead }.forEach { fighter ->
            // Check for premature end of the round - nobody left to fight
            if (!keepFighting()) {
                return false
            }

            // If we are already in range, stop moving.
            var target: Fighter? = fighter.inRange(fighters).firstOrNull()
            if (target == null) {
                // Movement
                val path = fighter.findPathToBestEnemyAdjacentSpot(fighters, caves)
                if (path.isNotEmpty()) {
                    fighter.moveTo(path.first(), caves)
                }
                // Find target
                target = fighter.inRange(fighters).firstOrNull()
            }

            // Fight if we have a target
            target?.let {
                fighter.attack(it, caves)
            }
        }
        return true // Round ended at its natural end
    }

    private fun goFightGoblins(elfAttackPoints: Int = 3): Pair<Int, List<Fighter>> {
        fighters.filter { it.team == Team.Elf }.forEach { it.ap = elfAttackPoints }
        var rounds = 0
        while (round()) {
            rounds++
        }
        return Pair(rounds, fighters)
    }
    
    fun solvePart1(): Int {
        val result = goFightGoblins()
        return result.second.filterNot { it.dead }.sumBy { it.hp } * result.first
    }

    fun solvePart2(): Int =
        generateSequence(4, Int::inc).map { ap ->
            // Reset
            caves = parseCaves()
            fighters = Fighter.findFighters(caves)

            val result = goFightGoblins(ap)
            if (result.second.filter { it.team == Team.Elf }.none { it.dead }) {
                result.second.filterNot { it.dead }.sumBy { it.hp } * result.first
            } else {
                null
            }
        }
            .filterNotNull()
            .first()
}

private enum class Team(val logo: Char) {
    Elf('E'),
    Goblin('G');

    companion object {
        fun byLogo(logo: Char): Team? =
            values().firstOrNull { logo == it.logo }
    }
}

private data class Fighter(
    val team: Team,
    var location: Point15,
    var hp: Int = 200,
    var ap: Int = 3,
    var dead: Boolean = false
) : Comparable<Fighter> {

    override fun compareTo(other: Fighter): Int =
        location.compareTo(other.location)

    // Enemies are in range if they are not me, neither of us is dead,
    // we are not on the same team, and only 1 square away
    fun inRange(others: List<Fighter>): List<Fighter> =
        others.filter {
            it != this &&
                    !this.dead &&
                    !it.dead &&
                    it.team != this.team &&
                    this.location.distanceTo(it.location) == 1
        }
            .sortedWith(compareBy({ it.hp }, { it.location }))
    
    fun moveTo(place: Point15, caves: Caves) {
        // We need to alter the caves because we use it for pathfinding
        caves[location.y][location.x] = '.'
        location = place
        caves[location.y][location.x] = team.logo
    }

    fun attack(target: Fighter, caves: Caves) {
        target.hp -= this.ap
        if (target.hp <= 0) {
            // Mark enemy as dead and clean up the corpse
            target.dead = true
            caves[target.location.y][target.location.x] = '.'
        }
    }

    private fun enemyAdjacentOpenSpots(fighters: List<Fighter>, caves: Caves): Set<Point15> =
        fighters
            .filterNot { it.dead }
            .filterNot { it.team == team }
            .flatMap { it.location.cardinalNeighbors().filter { neighbor -> caves[neighbor.y][neighbor.x] == '.' } }
            .toSet()

    private fun pathToAnyEnemy(
        enemies: Set<Point15>,
        caves: Caves
    ): Path {
        val seen: MutableSet<Point15> = mutableSetOf(location)
        val paths: ArrayDeque<Path> = ArrayDeque()

        // Seed the queue with each of our neighbors, in reading order (that's important)
        location.cardinalNeighbors()
            .filter { caves[it.y][it.x] == '.' }
            .forEach { paths.add(listOf(it)) }

        // While we still have paths to examine, and haven't found the answer yet...
        while (paths.isNotEmpty()) {
            val path: Path = paths.removeFirst()
            val pathEnd: Point15 = path.last()

            // If this is one of our destinations, return it
            if (pathEnd in enemies) {
                return path
            }

            // If this is a new path, create a set of new paths from it for each of its
            // cardinal direction (again, in reader order), and add them all back
            // to the queue.
            if (pathEnd !in seen) {
                seen.add(pathEnd)
                pathEnd.cardinalNeighbors()
                    .filter { caves[it.y][it.x] == '.' }
                    .filterNot { it in seen }
                    .forEach { paths.add(path + it) }
            }
        }
        return emptyList()
    }

    fun findPathToBestEnemyAdjacentSpot(
        fighters: List<Fighter>,
        caves: Caves
    ): Path =
        pathToAnyEnemy(
            enemyAdjacentOpenSpots(fighters, caves),
            caves
        )
    
    companion object {
        fun findFighters(caves: Caves): List<Fighter> =
            caves.mapIndexed { y, row ->
                row.mapIndexed { x, spot ->
                    Team.byLogo(spot)?.let {
                        Fighter(it, Point15(x, y))
                    }
                }
            }
                .flatten()
                .filterNotNull()
    }

}

data class Point15(val x: Int, val y: Int) : Comparable<Point15> {

    fun distanceTo(otherX: Int, otherY: Int): Int =
        abs(x - otherX) + abs(y - otherY)

    fun distanceTo(other: Point15): Int =
        distanceTo(other.x, other.y)

    fun cardinalNeighbors(allowNegative: Boolean = true): List<Point15> =
        // Note: Generate in reading order!
        listOf(
            Point15(x, y - 1),
            Point15(x - 1, y),
            Point15(x + 1, y),
            Point15(x, y + 1)
        ).filter { allowNegative || it.x >= 0 && it.y >= 0 }

    override fun compareTo(other: Point15): Int =
        when {
            y < other.y -> -1
            y > other.y -> 1
            x < other.x -> -1
            x > other.x -> 1
            else -> 0
        }

    companion object {
        fun of(input: String): Point15 =
            input.split(",")
                .map { it.trim().toInt() }
                .run { Point15(this[0], this[1]) }
    }
}

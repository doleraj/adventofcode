package y2018

operator fun <T> List<MutableList<T>>.set(v: Vector2D, value: T) {
    when {
        v.y !in indices -> throw IndexOutOfBoundsException("index: ${v.y}.${v.x}")
        v.x !in this[v.y].indices -> throw IndexOutOfBoundsException("index: ${v.y}.${v.x}")
        else -> this[v.y][v.x] = value
    }
}

operator fun <T> List<MutableList<T>>.set(i: Int, j: Int, value: T) {
    this[i][j] = value
}

operator fun <T> List<List<T>>.get(v: Vector2D): T? = when {
    v.y !in indices -> null
    v.x !in this[v.y].indices -> null
    else -> this[v.y][v.x]
}

data class Vector2D(
    var x: Int = 0,
    var y: Int = 0,
) {
    operator fun plus(other: Vector2D) = Vector2D(x + other.x, y + other.y)
}

enum class Directions(val step: Vector2D) {
    U(0, -1),
    D(0, 1),
    L(-1, 0),
    R(1, 0),
    UL(-1, -1),
    UR(1, -1),
    DL(-1, 1),
    DR(1, 1),
    ;

    constructor(x: Int, y: Int) : this(Vector2D(x, y))

    companion object {
        val Neighbors4 = listOf(U, D, L, R)
    }
}

class Day15(private val rawInput: List<String>) {
    fun solvePart1(): Any? {
        val matrix: List<List<Char>> by lazy { rawInput.map { it.toList() } }
        val map = matrix

        var characters = map
            .flatMapIndexed() { y, row ->
                row.mapIndexedNotNull { x, c ->
                    if (c in listOf('E', 'G')) Character(Vector2D(x, y), c, 3, 200) else null
                }
            }

        val walls = map
            .map { row ->
                row.map { if (it == '#') -1 else Int.MAX_VALUE }
            }

        (0..1_000_000_000).forEach { round ->
            characters = characters
                .filter { it.hit > 0 }
                .sortedWith(compareBy({ it.pos.y }, { it.pos.x }))
                .toMutableList()

            for (character in characters) {
                if (character.hit <= 0) {
                    continue
                }

                if (characters.none { it.hit > 0 && it.type != character.type }) {
                    return round * characters.filter { it.hit > 0 && it.type == character.type }.sumOf { it.hit }
                }

                val targets = characters.filter { it.hit > 0 && it.type != character.type }
                val currMap = walls.map { it.toMutableList() }

                characters
                    .filter { it.hit > 0 }
                    .forEach { other -> currMap[other.pos] = -1 }

                currMap[character.pos] = Int.MAX_VALUE

                val adjacent = targets
                    .flatMap { target ->
                        Directions.Neighbors4.map { target.pos + it.step }
                    }
                    .distinct()
                    .filter { cell -> currMap[cell] != -1 }

                if (adjacent.isEmpty()) {
                    continue
                }

                val queue = ArrayDeque(listOf(character.pos to 0))
                while (queue.isNotEmpty()) {
                    val (pos, step) = queue.removeFirst()
                    if (currMap[pos]!! > step) {
                        currMap[pos] = step
                        queue += Directions.Neighbors4
                            .map { pos + it.step }
                            .filter { currMap[it] != -1 }
                            .filter { currMap[it]!! > step + 1 }
                            .map { it to step + 1 }
                    }
                }

                val minDistance = adjacent.minOf { currMap[it] ?: Int.MAX_VALUE }

                if (minDistance == Int.MAX_VALUE) {
                    continue
                }

                if (minDistance > 0) {
                    val nearest = adjacent
                        .filter { currMap[it] == minDistance }
                        .minWith(compareBy({ it.y }, { it.x }))

                    val moves = mutableListOf<Vector2D>()

                    val revQueue = ArrayDeque(listOf(nearest to minDistance))
                    while (revQueue.isNotEmpty()) {
                        val (pos, step) = revQueue.removeFirst()
                        if (step == 1) {
                            moves += pos
                        } else {
                            revQueue += Directions.Neighbors4
                                .map { pos + it.step }
                                .filter { currMap[it] != -1 }
                                .filter { currMap[it] == step - 1 }
                                .map { (it to step - 1) }
                        }
                    }

                    val move = moves.minWith(compareBy({ it.y }, { it.x }))
                    character.pos = move
                }

                val canHit = Directions.Neighbors4.map { character.pos + it.step }

                val target = targets.filter { it.pos in canHit }
                    .minWithOrNull(compareBy({ it.hit }, { it.pos.y }, { it.pos.x }))

                target?.let {
                    it.hit -= character.attack
                }
            }
        }

        return null
    }

    fun solvePart2(): Any? {
        val matrix: List<List<Char>> by lazy { rawInput.map { it.toList() } }
        val map = matrix

        val walls = map
            .map { row ->
                row.map { if (it == '#') -1 else Int.MAX_VALUE }
            }

        return (3..200).first { elvenHit ->
            var characters = map
                .flatMapIndexed() { y, row ->
                    row.mapIndexedNotNull { x, c ->
                        when (c) {
                            'E' -> Character(Vector2D(x, y), c, elvenHit, 200)
                            'G' -> Character(Vector2D(x, y), c, 3, 200)
                            else -> null
                        }
                    }
                }

            val elves = characters.count { it.type == 'E' }

            (0..1_000_000_000).forEach { round ->
                characters = characters
                    .filter { it.hit > 0 }
                    .sortedWith(compareBy({ it.pos.y }, { it.pos.x }))
                    .toMutableList()

                if (characters.count { it.hit > 0 && it.type == 'E' } != elves) {
                    return@first false
                }

                for (character in characters) {
                    if (character.hit <= 0) {
                        if (character.type == 'E') {
                            return@first false
                        }
                        continue
                    }

                    if (characters.none { it.hit > 0 && it.type != character.type }) {
                        if (characters.count { it.hit > 0 && it.type == 'E' } == elves) {
                            return round * characters.filter { it.hit > 0 && it.type == character.type }.sumOf { it.hit }
                        }
                    }

                    val targets = characters.filter { it.hit > 0 && it.type != character.type }
                    val currMap = walls.map { it.toMutableList() }

                    characters
                        .filter { it.hit > 0 }
                        .forEach { other -> currMap[other.pos] = -1 }

                    currMap[character.pos] = Int.MAX_VALUE

                    val adjacent = targets
                        .flatMap { target ->
                            Directions.Neighbors4.map { target.pos + it.step }
                        }
                        .distinct()
                        .filter { currMap[it] != -1 }

                    if (adjacent.isEmpty()) {
                        continue
                    }

                    val queue = ArrayDeque(listOf(character.pos to 0))
                    while (queue.isNotEmpty()) {
                        val (pos, step) = queue.removeFirst()
                        if (currMap[pos]!! > step) {
                            currMap[pos] = step
                            queue += Directions.Neighbors4
                                .map { pos + it.step }
                                .filter { currMap[it] != -1 }
                                .filter { currMap[it]!! > step + 1 }
                                .map { (it to step + 1) }
                        }
                    }

                    val minDistance = adjacent.minOf { currMap[it] ?: Int.MAX_VALUE }

                    if (minDistance == Int.MAX_VALUE) {
                        continue
                    }

                    if (minDistance > 0) {
                        val nearest = adjacent
                            .filter { currMap[it] == minDistance }
                            .minWith(compareBy({ it.y }, { it.x }))

                        val moves = mutableListOf<Vector2D>()

                        val revQueue = ArrayDeque(listOf(nearest to minDistance))
                        while (revQueue.isNotEmpty()) {
                            val (pos, step) = revQueue.removeFirst()
                            if (step == 1) {
                                moves += pos
                            } else {
                                revQueue += Directions.Neighbors4
                                    .map { pos + it.step }
                                    .filter { currMap[it] != -1 }
                                    .filter { currMap[it] == step - 1 }
                                    .map { (it to step - 1) }
                            }
                        }

                        val move = moves.minWith(compareBy({ it.y }, { it.x }))
                        character.pos = move
                    }

                    val canHit = Directions.Neighbors4.map { character.pos + it.step }

                    val target = targets.filter { it.pos in canHit }
                        .minWithOrNull(compareBy({ it.hit }, { it.pos.y }, { it.pos.x }))

                    target?.let {
                        it.hit -= character.attack
                    }
                }
            }
            return@first false
        }
    }

    data class Character(
        var pos: Vector2D,
        val type: Char,
        var attack: Int,
        var hit: Int
    )
}

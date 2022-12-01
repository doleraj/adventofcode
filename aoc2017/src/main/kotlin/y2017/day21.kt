package y2017

fun day21(iterations: Int, input: List<String>): Int {
    val rules = parseRules(input)
//    println(rules)

    val pattern = runIterations(iterations, rules)
    return pattern.map({ row -> row.count { item -> item == '#' }}).reduce({ acc, i -> acc + i })
}

fun parseRules(input: List<String>): List<Rule> {
    val rules = mutableListOf<Rule>()
    val pattern = Regex("([.#/]+) => ([.#/]+)")

    for (line in input) {
        val result = pattern.matchEntire(line)
        val lhs = result!!.groups[1]!!.value.split("/").map { row -> row.toCharArray().toList() }
        val rhs = result.groups[2]!!.value.split("/").map { row -> row.toCharArray().toList() }
        rules.add(Rule(lhs, rhs))
    }
    return rules
}

fun runIterations(iterations: Int, rules: List<Rule>): List<List<Char>> {
    var pattern = mutableListOf(
            mutableListOf('.', '#', '.'),
            mutableListOf('.', '.', '#'),
            mutableListOf('#', '#', '#')
    )

    var iteration = 0
    while (iteration++ < iterations) {

        val jumpSize = if (pattern.size != pattern[0].size) {
            throw Error("Non-square matrix :/")
        } else if (pattern.size % 2 == 0) {
            2
        } else if (pattern.size % 3 == 0) {
            3
        } else {
            continue
        }
        val newSize = pattern.size + (pattern.size / jumpSize)
        val newPattern = MutableList(newSize, init = { _ -> MutableList(newSize, init = { _ -> 'x' })})

        var row = 0
        var outRow = 0
        while (row < pattern.size) {
            var col = 0
            var outCol = 0
            while (col < pattern.size) {
                val square = getSquare(row, col, jumpSize, pattern)
                val outPattern = convertSquare(square, rules)
                var i = 0
                while (i <= jumpSize) {
                    var j = 0
                    while (j <= jumpSize) {
                        newPattern[outRow + i][outCol + j] = outPattern[i][j]
                        j++
                    }
                    i++
                }
                col += jumpSize
                outCol += jumpSize + 1
            }
            row += jumpSize
            outRow += jumpSize + 1
        }

//        println(newPattern)
//        println("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
       pattern = newPattern
    }

    return pattern
}

fun getSquare(row: Int, col: Int, jumpSize: Int, pattern: List<List<Char>>): List<List<Char>> {
    return when (jumpSize) {
        2 -> {
            return listOf(
                    listOf(pattern[row][col], pattern[row][col + 1]),
                    listOf(pattern[row + 1][col], pattern[row + 1][col + 1])
            )
        }
        3 -> {
            return listOf(
                    listOf(pattern[row][col], pattern[row][col + 1], pattern[row][col + 2]),
                    listOf(pattern[row + 1][col], pattern[row + 1][col + 1], pattern[row + 1][col + 2]),
                    listOf(pattern[row + 2][col], pattern[row + 2][col + 1], pattern[row + 2][col + 2])
            )
        }
        else -> {
            return arrayListOf()
        }
    }
}

fun convertSquare(square: List<List<Char>>, rules: List<Rule>): List<List<Char>> {
//    println("Checking " + square)
    for (rule in rules) {
        if (rule.matches(square)) {
            return rule.rhs
        }
    }

    throw Error("No matching rule!")
}

class Rule(lhs: List<List<Char>>, val rhs: List<List<Char>>) {
    val matchPatterns = generateMatchPatterns(lhs)

    fun generateMatchPatterns(lhs: List<List<Char>>): MutableSet<List<List<Char>>> {
        val patterns = mutableSetOf(lhs)

        var tmp = rotateMatrix(lhs)
        patterns.add(tmp)
        tmp = rotateMatrix(lhs)
        patterns.add(tmp)
        tmp = rotateMatrix(lhs)
        patterns.add(tmp)

        patterns.addAll(patterns.map { pattern -> mirrorMatrix(pattern) })
        patterns.addAll(patterns.map { pattern -> waterMatrix(pattern) })

        return patterns
    }

    fun matches(checkPattern: List<List<Char>>): Boolean {
        return matchPatterns.contains(checkPattern)
    }

    override fun toString(): String {
        return "y2017.Rule(rhs=$rhs, matchPatterns=$matchPatterns)"
    }
}

fun rotateMatrix(mat: List<List<Char>>): List<List<Char>> {
    val N = mat.size
    val out = mat.toMutableList().map { row -> row.toMutableList() }

    // Consider all squares one by one
    for (y in 0 until N / 2) {
        // Consider elements in group of 4 in
        // current square
        for (x in y until N - y - 1) {
            // store current cell in temp variable
            val temp = mat[y][x]

            // move values from right to top
            out[y][x] = mat[x][N - 1 - y]

            // move values from bottom to right
            out[x][N - 1 - y] = mat[N - 1 - y][N - 1 - x]

            // move values from left to bottom
            out[N - 1 - y][N - 1 - x] = mat[N - 1 - x][y]

            // assign temp to left
            out[N - 1 - x][y] = temp
        }
    }
    return out
}

fun mirrorMatrix(mat: List<List<Char>>): List<List<Char>> {
    val N = mat.size
    val out = mat.toMutableList().map { row -> row.toMutableList() }

    for (y in 0 until N) {
        for (x in 0 until N / 2) {
            val temp = mat[y][x]
            out[y][x] = mat[y][N - 1 - x]
            out[y][N - 1 - x] = temp
        }
    }
    return out
}

fun waterMatrix(mat: List<List<Char>>): List<List<Char>> {
    val N = mat.size
    val out = mat.toMutableList().map { row -> row.toMutableList() }

    for (y in 0 until N / 2) {
        for (x in 0 until N) {
            val temp = mat[y][x]
            out[y][x] = mat[N - 1 - y][x]
            out[N - 1 - y][x] = temp
        }
    }
    return out
}
package y2018


fun day12(potState: String, rulesStrings: List<String>): Int {
    val pots = getInitialPots(potState)
    val rules = getRules(rulesStrings)

    System.out.println("0: ${pots.getSortedValues().joinToString("") { pair -> pair.second }}")
    (1..20).forEach { t: Int ->
        pots.getAllPots().map { pair ->
            val potCells = (-2..2).toList().map { i -> pots.getPot(i + pair.first) }.joinToString("") { cellPair -> cellPair.second }
            Pair(pair.first, rules[potCells]!!)
        }.map { pair ->
            pots.setPot(pair.first, pair.second)
        }

        System.out.println("$t: ${pots.getSortedValues().joinToString("") { pair -> pair.second }}")
    }

    return pots.getSumValue()
}

fun day12Second(potState: String, rulesStrings: List<String>): Long {
    val pots = getInitialPots(potState)
    val rules = getRules(rulesStrings)

//    System.out.println("0: ${pots.getSortedValues().joinToString("") { pair -> pair.second }}")
    var lastsum = 0
    (1..195).forEach { t: Int ->
        pots.getAllPots().map { pair ->
            val potCells = (-2..2).toList().map { i -> pots.getPot(i + pair.first) }.joinToString("") { cellPair -> cellPair.second }
            Pair(pair.first, rules[potCells]!!)
        }.map { pair ->
            pots.setPot(pair.first, pair.second)
        }

//        System.out.println("$t: ${pots.getSortedValues().joinToString("") { pair -> pair.second }}")
//        val curSum = pots.getSumValue()
//        System.out.println("Generation $t, $curSum, delta of ${curSum - lastsum}")
//        lastsum = curSum
    }

    return pots.getSumValue() + (50_000_000_000 - 195) * 53
}

fun getInitialPots(input: String): Pots {
    return Pots(input.split("").slice((1.. input.length)).mapIndexed { index, s -> Pair(index, s) })
}

class Pots(input: List<Pair<Int, String>>) {
    private var values = input.toMutableList()

    fun getPot(index: Int): Pair<Int, String> {
        return values.find { pair -> pair.first == index } ?: Pair(index, ".")
    }

    fun setPot(index: Int, value: String) {
        values.removeIf { t -> index == t.first }
        values.add(Pair(index, value))
    }

    fun getAllPots(): List<Pair<Int, String>> {
        val minIndexPot = values.minBy { pair -> pair.first }!!
        if (minIndexPot.second == "#") {
            values.add(Pair(minIndexPot.first - 1, "."))
            values.add(Pair(minIndexPot.first - 2, "."))
        }

        val maxIndexPot = values.maxBy { pair -> pair.first }!!
        if (maxIndexPot.second == "#") {
            values.add(Pair(maxIndexPot.first + 1, "."))
            values.add(Pair(maxIndexPot.first + 2, "."))
        }

        return values.sortedBy { pair -> pair.first }
    }

    fun getSortedValues(): List<Pair<Int, String>> {
        return values.sortedBy { pair -> pair.first }
    }

    fun getSumValue(): Int {
        return values.map { pair -> if (pair.second == "#") { pair.first } else { 0 } }.sum()
    }
}

val rulesRegex = "([\\.#]{5}) => ([\\.#])".toRegex()
fun getRules(input: List<String>): Map<String, String> {
    return input.map { s -> val matcher = rulesRegex.matchEntire(s); Pair(matcher!!.groups[1]!!.value, matcher.groups[2]!!.value) }.toMap()
}
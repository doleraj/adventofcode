package y2018


fun day13(input: List<List<String>>): Pair<Int, Int> {


    return Pair(0, 0)
}
//
//fun day12Second(potState: String, rulesStrings: List<String>): Long {
//    val pots = getInitialPots(potState)
//    val rules = getRules(rulesStrings)
//
////    System.out.println("0: ${pots.getSortedValues().joinToString("") { pair -> pair.second }}")
//    var lastsum = 0
//    (1..195).forEach { t: Int ->
//        pots.getAllPots().map { pair ->
//            val potCells = (-2..2).toList().map { i -> pots.getPot(i + pair.first) }.joinToString("") { cellPair -> cellPair.second }
//            Pair(pair.first, rules[potCells]!!)
//        }.map { pair ->
//            pots.setPot(pair.first, pair.second)
//        }
//
////        System.out.println("$t: ${pots.getSortedValues().joinToString("") { pair -> pair.second }}")
////        val curSum = pots.getSumValue()
////        System.out.println("Generation $t, $curSum, delta of ${curSum - lastsum}")
////        lastsum = curSum
//    }
//
//    return pots.getSumValue() + (50_000_000_000 - 195) * 53
//}
enum class Direction {
    N,
    E,
    S,
    W
}

class Cart(private var location: Pair<Int, Int>, val facing: Direction) {

    fun moveCart() {
        location = when(facing) {
            Direction.N -> location.copy(second = location.second - 1)
            Direction.E -> location.copy(second = location.first + 1)
            Direction.S -> location.copy(second = location.second + 1)
            Direction.W -> location.copy(second = location.first - 1)
        }


    }

}

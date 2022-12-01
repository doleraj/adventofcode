package y2015

fun day6(input: List<String>): Int {
    var lights = List(1000) { List(1000) { false } }


    return lights.map { list -> (list.filter { b -> b }.size) }.sum()
}


//fun day6Second(input: List<String>): Int {
//    return input.map { s -> isNiceSecond(s) }.filter { b -> b }.size
//}
//
//val twoLetterRepeatRegex = "([a-z]{2}).*\\1".toRegex()
//val oneLetterRepeatRegex = "([a-z])[a-z]\\1".toRegex()
//fun isNiceSecond(input: String): Boolean {
//    return twoLetterRepeatRegex.containsMatchIn(input) &&
//            oneLetterRepeatRegex.containsMatchIn(input)
//
//}
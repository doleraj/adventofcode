package y2015

fun day5(input: List<String>): Int {
    return input.map { s -> isNice(s) }.filter { b -> b }.size
}

val vowelRegex = "(.*[aeiou]){3}".toRegex()
val doubleLetterRegex = "([a-z])\\1".toRegex()
val notContainsRegex = "(ab|cd|pq|xy)".toRegex()
fun isNice(input: String): Boolean {
    return vowelRegex.containsMatchIn(input) &&
            doubleLetterRegex.containsMatchIn(input) &&
            !notContainsRegex.containsMatchIn(input)

}

fun day5Second(input: List<String>): Int {
    return input.map { s -> isNiceSecond(s) }.filter { b -> b }.size
}

val twoLetterRepeatRegex = "([a-z]{2}).*\\1".toRegex()
val oneLetterRepeatRegex = "([a-z])[a-z]\\1".toRegex()
fun isNiceSecond(input: String): Boolean {
    return twoLetterRepeatRegex.containsMatchIn(input) &&
            oneLetterRepeatRegex.containsMatchIn(input)

}
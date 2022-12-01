package y2018

fun buildRegex(): Regex {
    val chars = ('a'..'z').toList().map { c: Char -> "" + c + c.toUpperCase() }.joinToString("|") { s -> s }
    val reversed = chars.reversed()
    return "($chars|$reversed)".toRegex()
}

fun day5(input: String): Int {
    return fullyReact(input)
}

fun fullyReact(input: String): Int {
    val regex = buildRegex()
    var working = input
    while (regex.containsMatchIn(working)) {
        working = regex.replace(working, "")
    }
    return working.length
}

fun day5Second(input: String): Int {
     val foo = ('a'..'z').toList()
            .map { c: Char -> "($c|" + c.toUpperCase() + ")"}
            .map { s -> s.toRegex() }
            .map { regex -> regex.replace(input, "") }
            .map { s -> fullyReact(s) }


    System.out.println(foo)
    return foo.min()!!
}

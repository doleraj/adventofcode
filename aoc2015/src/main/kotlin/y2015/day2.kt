package y2015

fun day2(input: List<String>): Int {
    return input
            .map { s -> s.split("x") }
            .map { list -> list.map { s -> s.toInt() } }
            .map { list -> listOf(list[0] * list[1], list[1] * list[2], list[0] * list[2]) }
            .flatMap { list -> listOf(list.min()!!, *list.map { i -> 2 * i }.toTypedArray()) }
            .sum()
}

fun day2Second(input: List<String>): Int {
    return input
            .map { s -> s.split("x") }
            .map { list -> list.map { s -> s.toInt() } }
            .flatMap { list -> listOf(listOf(list[0] * 2 + list[1] * 2, list[1] * 2 + list[2] * 2, list[0] * 2 + list[2] * 2).min()!!, list[0] * list[1] * list[2])}
            .sum()
}

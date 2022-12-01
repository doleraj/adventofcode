package y2017

fun day3(start: Int): Int{
   return generateSpiral().take(start).last().run { Math.abs(first) + Math.abs(second) }
}

fun generateSpiral(): Sequence<Pair<Int, Int>> = sequence {
    var x = 0
    var y = 0
    var dx = 0
    var dy = 1

    while(true) {
        yield(Pair(x, y))

        if ((Math.abs(x) == Math.abs(y) && (x < 0 || y < 0))  || ( x >= 0 && 1 == (y - x))) {
            val tmp = dx
            dx = -dy
            dy = tmp
        }

        x += dx
        y += dy
    }
}
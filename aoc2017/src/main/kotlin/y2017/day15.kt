package y2017

fun day15(aVal: Long, bVal: Long): Long {

    val generatorA = Generator(16807, aVal, 4)
    val generatorB = Generator(48271, bVal, 8)

    var pairCount = 0
    var matches = 0L
//    while (pairCount++ < 5) {
    while (pairCount++ < 40000000) {
        matches += compareGeneratorVals(generatorA.next(), generatorB.next())
    }
    return matches
}

fun day15Second(aVal: Long, bVal: Long): Long {
    val generatorA = Generator(16807, aVal, 4)
    val generatorB = Generator(48271, bVal, 8)

    var pairCount = 0
    var matches = 0L
//    while (pairCount++ < 5) {
    while (pairCount++ < 5000000) {
//        val fooA = generatorA.pickyNext()
//        val fooB = generatorB.pickyNext()
        matches += compareGeneratorVals(generatorA.pickyNext(), generatorB.pickyNext())
//        matches += y2017.compareGeneratorVals(fooA, fooB)
    }
    return matches
}

fun compareGeneratorVals(first: Long, second: Long): Long {
    val firstStr = first.toString(2).padStart(32, '0')
    val secondStr = second.toString(2).padStart(32, '0')
    val tinyFirst = firstStr.substring(16)
    val tinySecond = secondStr.substring(16)
    return if (tinyFirst == tinySecond) 1 else 0
}

class Generator(val factor: Long, var previous: Long, val pickyCheck: Int) {
    fun next(): Long {
        var next = previous * factor
        next = next.rem(2147483647)
        previous = next
        return next
    }

    fun pickyNext(): Long {
        var nextVal = next()
        while (nextVal % pickyCheck != 0L) {
            nextVal = next()
        }
        return nextVal
    }
}
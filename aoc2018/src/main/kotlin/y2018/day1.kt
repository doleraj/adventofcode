package y2018

fun day1(input: Array<String>): Int {
    var frequency = 0

    for (change in input) {
        val changeVal = change.toInt()
        frequency += changeVal
    }

    return frequency
}

fun day1Second(input: Array<String>): Int {
    var frequency = 0
    val frequencyCount = mutableSetOf(0)

    while (true) {
        for (change in input) {
            val changeVal = change.toInt()
            frequency += changeVal
            if (!frequencyCount.contains(frequency)) {
                frequencyCount.add(frequency)
            } else {
                return frequency
            }
        }
    }
}

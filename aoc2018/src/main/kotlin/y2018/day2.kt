package y2018

fun day2(input: Array<String>): Int {
    var twiceCount = 0
    var thriceCount = 0

    for (id in input) {
        val checks = checksum(id)
        if (checks.first) {
            twiceCount++
        }
        if (checks.second) {
            thriceCount++
        }
    }
    return twiceCount * thriceCount
}

fun checksum(input: String): Pair<Boolean, Boolean> {
    var charAppearsExactlyTwice = false
    var charAppearsExactlyThrice = false
    for (char in input) {
        charAppearsExactlyTwice = charAppearsExactlyTwice || input.matches(Regex("([^$char]*$char){2}[^$char]*"))
        charAppearsExactlyThrice = charAppearsExactlyThrice || input.matches(Regex("([^$char]*$char){3}[^$char]*"))
    }
    return Pair(charAppearsExactlyTwice, charAppearsExactlyThrice)
}


fun day2Second(input: Array<String>): String {
    val parcels = mutableMapOf<String, MutableSet<Pair<String, String>>>()
    for (id in input) {
        var charIndex = 0
        parcels[id] = mutableSetOf()
        while (charIndex < id.length) {
            val first = id.substring(0, charIndex)
            val second = id.substring(charIndex + 1, id.length)
            parcels[id]!!.add(Pair(first, second))

            charIndex++
        }
    }

    for (left in input) {
        val leftSet = parcels[left]!!
        for (right in input) {
            if (left == right) {
              continue
            }

            val intersection = leftSet.intersect(parcels[right]!!)
            if (intersection.isNotEmpty()) {
                return intersection.first().first + intersection.first().second
            }
        }
    }

    return ""
}


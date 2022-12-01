package y2017

import java.util.*

fun day6(initial: Array<Int>): Int {
    val knownStates:MutableList<Array<Int>> = mutableListOf()

    var current = initial
    var count = 0
    while (knownStates.filter { array -> Arrays.equals(array, current) }.isEmpty()) {
        knownStates.add(current)
        current = reallocate(current)
        count++
    }
    return count
}

fun day6Second(initial: Array<Int>): Int {
    val knownStates:MutableMap<Array<Int>, Int> = mutableMapOf()

    var current = initial
    var count = 0
    while (knownStates.filter { entry -> Arrays.equals(entry.key, current) }.isEmpty()) {
        knownStates.put(current, count)
        current = reallocate(current)
        count++
    }
    val oldCount: Int = knownStates.filter({ entry -> Arrays.equals(entry.key, current) }).values.stream().findAny().get()
    return count - oldCount
}

fun reallocate(banks: Array<Int>): Array<Int> {
    val newBanks = banks.clone()
    var index = banks.indexOf(banks.max())
    var blocksToAllocate = banks[index]
    newBanks[index] = 0

    while (blocksToAllocate > 0) {
        index = if (++index == newBanks.size) 0 else index
        newBanks[index]++
        blocksToAllocate--
    }
    return newBanks
}
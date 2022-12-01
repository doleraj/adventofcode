package y2018

import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.time.temporal.ChronoField
import java.time.format.DateTimeFormatterBuilder

fun day4(input: Array<String>): Int {
    val guards = getGuards(input)

    val sleepiestGuard = guards.maxBy { guard -> guard.getTotalNapDuration() }!!
    val sleepiestMinute = sleepiestGuard.getMinuteMostAsleep();
    return sleepiestGuard.id * sleepiestMinute
}

fun day4Second(input: Array<String>): Int {
    val guards = getGuards(input)

    val sleepiestGuard = guards.map { guard -> Pair(guard.id, guard.getMinuteMostAsleepWithSleepCount()) }
            .maxBy { pair -> pair.second.second }

   System.out.println(sleepiestGuard)

    return sleepiestGuard!!.first * sleepiestGuard.second.first
}


fun getGuards(input: Array<String>): MutableList<Guard> {
    val guards = mutableListOf<Guard>()
    val timeEntries = mutableListOf<Triple<LocalDateTime, String, Int>>()
    val regex = Regex("^\\[(\\d+-\\d+-\\d+ \\d+:\\d+)] (Guard #(\\d+) begins shift|falls asleep|wakes up)$")
    val formatter = DateTimeFormatterBuilder().appendPattern("uuuu-MM-dd HH:mm")
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .toFormatter()

    for (line in input) {
        val result = regex.find(line)
        if (result != null) {
            val groups = result.groups
            val timeStr = groups[1]!!.value
            val type = groups[2]!!.value
            val guardId = groups[3]?.value?.toInt()

            val time = LocalDateTime.parse(timeStr, formatter)

            if (type.startsWith("Guard")) {
                if (guards.find { guard -> guard.id == guardId } == null) {
                    guards.add(Guard(guardId!!))
                }
                timeEntries.add(Triple(time, "begins shift", guardId!!))
            } else {
                timeEntries.add(Triple(time, type, -1))
            }
        }
    }

    timeEntries.sortBy { triple -> triple.first }

    var guard: Guard? = null
    var napStartTime: LocalDateTime? = null
    for (entry in timeEntries) {
        if (entry.second == "begins shift") {
            guard = guards.find { g -> entry.third == g.id }
        } else if (entry.second == "falls asleep") {
            napStartTime = entry.first
        } else if (entry.second == "wakes up") {
            guard?.addNap(napStartTime!!, entry.first)
        }
    }

    return guards
}

class Guard(val id: Int) {
    val naps: MutableList<Pair<Int, Int>> = mutableListOf()

    fun addNap(start: LocalDateTime, end: LocalDateTime) {
        end.minus(1, ChronoUnit.MINUTES)
        naps.add(Pair(start.get(ChronoField.MINUTE_OF_HOUR), end.get(ChronoField.MINUTE_OF_HOUR)))
    }

    fun getTotalNapDuration(): Int {
        return naps
            .map { nap -> IntProgression.fromClosedRange(nap.first, nap.second, 1).asSequence().count() }
            .sum()
    }

    fun getMinuteMostAsleep(): Int {
        return getMinuteMostAsleepWithSleepCount().first
    }

    fun getMinuteMostAsleepWithSleepCount(): Pair<Int, Int> {
        return naps
                .flatMap { nap -> IntProgression.fromClosedRange(nap.first, nap.second, 1).asIterable() }
                .groupingBy { it }
                .eachCount()
                .maxBy { entry -> entry.value }
                ?.toPair() ?: Pair(id, -1)
    }
}

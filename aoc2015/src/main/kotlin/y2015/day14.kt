package y2015

val day14ParseRegex = "([a-zA-Z]+) can fly (\\d+) km/s for (\\d+) seconds, but then must rest for (\\d+) seconds.".toRegex();

class Reindeer(val name: String, val flySpeed: Int, val flyTime: Int, val restTime: Int) {
    var flying = true;
    var distanceTraveled = 0;
    var flyingSeconds = 0;
    var restingSeconds = 0;
    var points = 0;

    override fun toString(): String {
        return "Reindeer(name='$name', flySpeed=$flySpeed, flyTime=$flyTime, restTime=$restTime, flying=$flying, distanceTraveled=$distanceTraveled), point=$points"
    }

    fun tick() {
        if (flying) {
            flyingSeconds++;
            distanceTraveled += flySpeed;

            if (flyingSeconds == flyTime) {
                flyingSeconds = 0;
                flying = false;
            }
        } else {
            restingSeconds++;

            if (restingSeconds == restTime) {
                restingSeconds = 0;
                flying = true;
            }
        }
    }
}

fun day14Parse(input: List<String>): List<Reindeer> {
    return input.map { line ->
        val match = day14ParseRegex.find(line)!!;

        Reindeer(match.groupValues[1], match.groupValues[2].toInt(), match.groupValues[3].toInt(), match.groupValues[4].toInt());
    }
}

fun day14(numSeconds: Int, input: List<String>): Int {
    val reindeer = day14Parse(input);

    for (i in 0 until numSeconds) {
        reindeer.forEach { deer -> deer.tick() };
    }

    return reindeer.map { it.distanceTraveled }.sortedDescending()[0];
}

fun day14Second(numSeconds: Int, input: List<String>): Int {

    val reindeer = day14Parse(input);

    for (i in 0 until numSeconds) {
        reindeer.forEach { deer -> deer.tick() };
        val maxDistance = reindeer.maxOfOrNull { it.distanceTraveled };
        val allWinningDeer = reindeer.filter { it.distanceTraveled == maxDistance };
        allWinningDeer.forEach { it.points++ };
    }
    println(reindeer);

    return reindeer.map { it.points }.sortedDescending()[0];
}

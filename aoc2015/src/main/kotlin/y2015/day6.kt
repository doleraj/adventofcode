package y2015

val day6regexp = "(turn on|turn off|toggle) (\\d+,\\d+) through (\\d+,\\d+)".toRegex();

fun day6(input: List<String>): Int {
    val lights = MutableList(1000) { MutableList(1000) { 0 } }

    for (instruction in input) {
        val match = day6regexp.matchEntire(instruction) ?: return -1;

        val coord1 = match.groupValues[2].split(",").map { it.toInt() };
        val coord2 = match.groupValues[3].split(",").map { it.toInt() };

        val operation = match.groupValues[1];
        for (x in coord1[0]..coord2[0]) {
            for (y in coord1[1]..coord2[1]) {
                if (operation == "turn on") {
                    lights[x][y] = 1;
                } else if (operation == "turn off") {
                    lights[x][y] = 0;
                } else {
                    lights[x][y] = if (lights[x][y] == 1) 0 else 1;
                }
            }
        }

    }

    return lights.sumOf { list -> list.sum() }
}


fun day6Second(input: List<String>): Int {
    val lights = MutableList(1000) { MutableList(1000) { 0 } }

    for (instruction in input) {
        val match = day6regexp.matchEntire(instruction) ?: return -1;

        val coord1 = match.groupValues[2].split(",").map { it.toInt() };
        val coord2 = match.groupValues[3].split(",").map { it.toInt() };

        val operation = match.groupValues[1];
        for (x in coord1[0]..coord2[0]) {
            for (y in coord1[1]..coord2[1]) {
                if (operation == "turn on") {
                    lights[x][y] += 1;
                } else if (operation == "turn off") {
                    lights[x][y] -= 1;
                    if (lights[x][y] < 0) {
                        lights[x][y] = 0;
                    }
                } else {
                    lights[x][y] += 2;
                }
            }
        }

    }

    return lights.sumOf { list -> list.sum() }
}

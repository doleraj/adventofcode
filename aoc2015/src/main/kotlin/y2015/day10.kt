package y2015

fun day10(input: String): Int {
    var step = input;
    for (x in 0..39) {
        step = day10Step(step);
    }
    return step.length;
}

fun day10Step(input: String): String {
    val step = input.split("").toMutableList();
    step.removeFirst();
    step.removeLast();
    var output = "";
//    println(step);

    while (step.isNotEmpty()) {
        val digit = step.removeFirst();
        var count = 1;

        while (step.isNotEmpty() && step[0] == digit) {
            step.removeFirst();
            count++;
        }
//        println("$count $digit");
        output += "$count$digit";
    }

    return output;
}

fun day10Second(input: String): Int {
    var step = input;
    for (x in 0..49) {
        println("Step $x");
        step = day10Step(step);
    }
    return step.length;
}

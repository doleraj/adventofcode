package y2015

fun day11(input: String): String {
    var password = input;
    var iterations = 0;
    password = day11Increment(password);
    while (!day11IsValid(password)) {
        iterations++;

        if (iterations % 1000000 == 0) {
            println("$iterations -- $password");
        }
        password = day11Increment(password);
    }

    return password
}

fun day11Increment(input: String): String {
    var current = input.toCharArray();
    var currIndex = input.lastIndex + 1;

    do {
        if (currIndex <= input.lastIndex && current[currIndex] == '{') {
            current[currIndex] = 'a';
        }

        currIndex--;
        current[currIndex] = current[currIndex] + 1;
    } while (current[currIndex] == '{');

    return current.concatToString();
}

var day11IOLRegex = "[iol]".toRegex();
var day11StraightRegex = "(abc|bcd|cde|def|efg|fgh|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)".toRegex();
var day11DoublesRegex = "([a-z])\\1".toRegex();

fun day11IsValid(password: String): Boolean {

    if (day11IOLRegex.find(password) != null) {
        return false;
    }

    if (day11StraightRegex.find(password) == null) {
        return false;
    }

    if (day11DoublesRegex.findAll(password).toList().size < 2) {
        return false;
    }

    return true;
}

//fun day10Second(input: String): Int {
//    var step = input;
//    for (x in 0..49) {
//        println("Step $x");
//        step = day10Step(step);
//    }
//    return step.length;
//}

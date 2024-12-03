package y2015

fun day8(input: List<String>): Int {

    var sum = 0;
    for (line in input) {
        val codeLength = line.length;
        var modifiedString = line.substring(1, codeLength - 1);

        modifiedString = modifiedString.replace("\\\\", "\\");
        modifiedString = modifiedString.replace("\\\"", "\"");
        modifiedString = modifiedString.replace("""\\x[\da-f][\da-f]""".toRegex(), "?");
        sum += (codeLength - modifiedString.length);
    }

    return sum;
}

fun day8Second(input: List<String>): Int {
    var sum = 0;
    for (line in input) {
        val codeLength = line.length;
        var modifiedString = line;

        modifiedString = modifiedString.replace("\\", "\\\\");
        modifiedString = modifiedString.replace("\"", "\\\"");
        modifiedString = "\"" + modifiedString + "\"";

        sum += (modifiedString.length - codeLength);
    }

    return sum;
}
package y2015

val day25Regex = "To continue, please consult the code grid in the manual.  Enter the code at row (\\d+), column (\\d+).".toRegex()

fun runIteration(number: Long): Long {
    return (252533 * number) % 33554393;
}

fun day25(input: String): Long {
    val groups = day25Regex.matchEntire(input)!!.groupValues;
    val goalRow = groups[1].toInt();
    val goalColumn = groups[2].toInt();

    var value = 20151125L;
    var columnLimit = 3;
    for (row in 2 until goalRow + goalColumn) {
        for (column in 1 until columnLimit) {
            var actualRowNum = row + 1 - column ;
            value = runIteration(value);
//            println("Value for row $actualRowNum, col $column is $value")
            if (actualRowNum == goalRow && column == goalColumn) {
                break;
            }
        }
        columnLimit++;
    }

    return value;
}


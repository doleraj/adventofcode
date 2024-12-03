package y2015

val day7InitialSignalRegex = "(\\d+) -> ([a-z]+)".toRegex();
val day7SignalRegex = "([a-z]+) -> ([a-z]+)".toRegex();
val day7GetDestinationRegex = ".+ -> ([a-z]+)".toRegex();
val day7AndRegex = "([a-z]+|1) AND ([a-z]+) -> ([a-z]+)".toRegex();
val day7OrRegex = "([a-z]+) OR ([a-z]+) -> ([a-z]+)".toRegex();
val day7LshiftRegex = "([a-z]+) LSHIFT (\\d+) -> ([a-z]+)".toRegex();
val day7RshiftRegex = "([a-z]+) RSHIFT (\\d+) -> ([a-z]+)".toRegex();
val day7NotRegex = "NOT ([a-z]+) -> ([a-z]+)".toRegex();

fun day7(wireToCheck: String, input: List<String>): UShort {
    var wireValues = mutableMapOf<String, UShort>();
    var wireInstructions = mutableMapOf<String, String>();

    // Handle all assignments first and store the other instructions till later.
    for (line in input) {
        var match = day7InitialSignalRegex.matchEntire(line);
        if (match != null) {
            val value = Integer.parseInt(match.groupValues[1]).toUShort();
            val destination = match.groupValues[2];
            wireValues[destination] = value;
        } else {
            match = day7GetDestinationRegex.matchEntire(line);
            if (match != null) {
                val destination = match.groupValues[1];
                wireInstructions[destination] = line;
            }
        }
    }

    var nextWireInstructions = HashMap(wireInstructions)
    while (wireInstructions.size > 0) {
        wireInstructions = nextWireInstructions;
        nextWireInstructions = HashMap(wireInstructions);
        println("number of inst left: " + wireInstructions.size);

        for (instruction in wireInstructions) {
            var match = day7SignalRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val destination = match.groupValues[2];

                if (wireValues.contains(leftSide)) {
                    wireValues[destination] = wireValues[leftSide]!!;
                    nextWireInstructions.remove(destination);
                }
                continue;
            }
            match = day7AndRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val rightSide = match.groupValues[2];
                val destination = match.groupValues[3];

                if (leftSide == "1") {
                    if (wireValues.contains(rightSide)) {
                        wireValues[destination] = (1 and wireValues[rightSide]!!.toInt()).toUShort();
                        nextWireInstructions.remove(destination);
                    }
                } else {
                    if (wireValues.contains(leftSide) && wireValues.contains(rightSide)) {
                        wireValues[destination] = wireValues[leftSide]!! and wireValues[rightSide]!!;
                        nextWireInstructions.remove(destination);
                    }
                }


                continue;
            }
            match = day7OrRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val rightSide = match.groupValues[2];
                val destination = match.groupValues[3];

                if (wireValues.contains(leftSide) && wireValues.contains(rightSide)) {
                    wireValues[destination] = wireValues[leftSide]!! or wireValues[rightSide]!!;
                    nextWireInstructions.remove(destination);
                }
                continue;
            }

            match = day7NotRegex.matchEntire(instruction.value);
            if (match != null) {
                val rightSide = match.groupValues[1];
                val destination = match.groupValues[2];

                if (wireValues.contains(rightSide)) {
                    wireValues[destination] = wireValues[rightSide]!!.inv();
                    nextWireInstructions.remove(destination);
                }
                continue;
            }

            match = day7LshiftRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val shiftDistance = Integer.parseInt(match.groupValues[2]);
                val destination = match.groupValues[3];

                if (wireValues.contains(leftSide)) {
                    wireValues[destination] = (wireValues[leftSide]!!.toInt() shl shiftDistance).toUShort();
                    nextWireInstructions.remove(destination);
                }
                continue;
            }

            match = day7RshiftRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val shiftDistance = Integer.parseInt(match.groupValues[2]);
                val destination = match.groupValues[3];

                if (wireValues.contains(leftSide)) {
                    wireValues[destination] = (wireValues[leftSide]!!.toInt() shr shiftDistance).toUShort();
                    nextWireInstructions.remove(destination);
                }
                continue;
            }
        }
    }

    return wireValues[wireToCheck] ?: 0u;
}

fun day7Second(wireToCheck: String, input: List<String>): UShort {
    var wireValues = mutableMapOf<String, UShort>();
    var wireInstructions = mutableMapOf<String, String>();

    // Handle all assignments first and store the other instructions till later.
    for (line in input) {
        var match = day7InitialSignalRegex.matchEntire(line);
        if (match != null) {
            val value = Integer.parseInt(match.groupValues[1]).toUShort();
            val destination = match.groupValues[2];
            wireValues[destination] = value;
        } else {
            match = day7GetDestinationRegex.matchEntire(line);
            if (match != null) {
                val destination = match.groupValues[1];
                wireInstructions[destination] = line;
            }
        }
    }
    wireValues["b"] = 46_065.toUShort();

    var nextWireInstructions = HashMap(wireInstructions)
    while (wireInstructions.size > 0) {
        wireInstructions = nextWireInstructions;
        nextWireInstructions = HashMap(wireInstructions);
        println("number of inst left: " + wireInstructions.size);

        for (instruction in wireInstructions) {
            var match = day7SignalRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val destination = match.groupValues[2];

                if (wireValues.contains(leftSide)) {
                    wireValues[destination] = wireValues[leftSide]!!;
                    nextWireInstructions.remove(destination);
                }
                continue;
            }
            match = day7AndRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val rightSide = match.groupValues[2];
                val destination = match.groupValues[3];

                if (leftSide == "1") {
                    if (wireValues.contains(rightSide)) {
                        wireValues[destination] = (1 and wireValues[rightSide]!!.toInt()).toUShort();
                        nextWireInstructions.remove(destination);
                    }
                } else {
                    if (wireValues.contains(leftSide) && wireValues.contains(rightSide)) {
                        wireValues[destination] = wireValues[leftSide]!! and wireValues[rightSide]!!;
                        nextWireInstructions.remove(destination);
                    }
                }


                continue;
            }
            match = day7OrRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val rightSide = match.groupValues[2];
                val destination = match.groupValues[3];

                if (wireValues.contains(leftSide) && wireValues.contains(rightSide)) {
                    wireValues[destination] = wireValues[leftSide]!! or wireValues[rightSide]!!;
                    nextWireInstructions.remove(destination);
                }
                continue;
            }

            match = day7NotRegex.matchEntire(instruction.value);
            if (match != null) {
                val rightSide = match.groupValues[1];
                val destination = match.groupValues[2];

                if (wireValues.contains(rightSide)) {
                    wireValues[destination] = wireValues[rightSide]!!.inv();
                    nextWireInstructions.remove(destination);
                }
                continue;
            }

            match = day7LshiftRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val shiftDistance = Integer.parseInt(match.groupValues[2]);
                val destination = match.groupValues[3];

                if (wireValues.contains(leftSide)) {
                    wireValues[destination] = (wireValues[leftSide]!!.toInt() shl shiftDistance).toUShort();
                    nextWireInstructions.remove(destination);
                }
                continue;
            }

            match = day7RshiftRegex.matchEntire(instruction.value);
            if (match != null) {
                val leftSide = match.groupValues[1];
                val shiftDistance = Integer.parseInt(match.groupValues[2]);
                val destination = match.groupValues[3];

                if (wireValues.contains(leftSide)) {
                    wireValues[destination] = (wireValues[leftSide]!!.toInt() shr shiftDistance).toUShort();
                    nextWireInstructions.remove(destination);
                }
                continue;
            }
        }
    }

    return wireValues[wireToCheck] ?: 0u;
}
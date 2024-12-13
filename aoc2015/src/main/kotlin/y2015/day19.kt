package y2015

fun day19(input: List<String>): Int {
    val replacements = mutableListOf<Pair<String, String>>();
    var calibrationMolecule = "";
    input.forEach { line ->
        if (line.trim().isEmpty()) {
            return@forEach;
        }

        if (!line.contains("=>")) {
            calibrationMolecule = line.trim();
        } else {
            val split = line.split(" => ");
            replacements.add(Pair(split[0].trim(), split[1].trim()));
        }
    }

    val results = mutableSetOf<String>();
    for (replacement in replacements) {
        val regex = replacement.first.toRegex();
        val matches = regex.findAll(calibrationMolecule);

        for (match in matches) {
            results.add(calibrationMolecule.replaceRange(match.range, replacement.second));
        }

    }

//    println(results);
    return results.size;
}

var count = 0;

fun doReplacements(current: Pair<String, Int>, medicineMolecule: String, replacements: List<Pair<Regex, String>>, memos: MutableMap<Pair<String, Int>,Int>): Int {
    val currentStr = current.first;
    val currentStep = current.second;
//    println("Working with $currentStr")

    if (++count % 1000000 == 0) {
        println("$count: $currentStr at $currentStep")
    }

    if (memos.containsKey(current)) {
//        println("Hitting the cache")
        return memos[current]!!;
    }

    for (replacement in replacements) {
        if (replacement.second == "e" && currentStr.length != 1) {
            continue;
        } else if (replacement.second == "e") {
            println("WHEEE")
        }

        val matches = replacement.first.findAll(currentStr);

        for (match in matches) {
            val next = currentStr.replaceRange(match.range, replacement.second);
            if (next == medicineMolecule) {
                println("BEHOLD")
                return currentStep;
            }

            val result = doReplacements(Pair(next, currentStep + 1), medicineMolecule, replacements, memos);
            if (result != -1) {
                return result;
            } else {
                memos.put(current, result);
            }
        }
    }

    return -1;
}

fun day19Second(input: List<String>): Int {
    val replacements = mutableListOf<Pair<String, String>>();
    var medicineMolecule = "";
    input.forEach { line ->
        if (line.trim().isEmpty()) {
            return@forEach;
        }
        if (!line.contains("=>")) {
            medicineMolecule = line.trim();
        } else {
            val split = line.split(" => ");
            replacements.add(Pair(split[1].trim(), split[0].trim()));
        }
    }

    var molecule = medicineMolecule;
    var steps = 0;
    while (molecule != "e") {
        var replacementMatched = false;
        for (replacement in replacements) {
            if (replacement.second == "e") {
                continue;
            }

            val index = molecule.lastIndexOf(replacement.first);
            if (index != -1) {
                molecule = molecule.replaceRange(index, index + replacement.first.length, replacement.second);
                steps++;
                replacementMatched = true;
            }
        }

        if (!replacementMatched) {
            for (replacement in replacements.filter { r -> r.second == "e" }) {
                val index = molecule.lastIndexOf(replacement.first);
                if (index != -1) {
                    molecule = molecule.replaceRange(index, index + replacement.first.length, replacement.second);
                    steps++;
                }
            }
        }
    }

//    return doReplacements(Pair(medicineMolecule, 1), "e");
    return steps;
}

package y2018


fun addr(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]
    val secondValue = registers[b]

    registers[c] = firstValue + secondValue
}

fun addi(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]
//    println("$firstValue $b")

    registers[c] = firstValue + b
}

fun mulr(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]
    val secondValue = registers[b]

    registers[c] = firstValue * secondValue
}

fun muli(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]

    registers[c] = firstValue * b
}

fun banr(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]
    val secondValue = registers[b]

    registers[c] = firstValue and secondValue
}

fun bani(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]

    val result = firstValue and b
    registers[c] = result
}

fun borr(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]
    val secondValue = registers[b]

    registers[c] = firstValue or secondValue
}

fun bori(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]

    registers[c] = firstValue or b
}

fun setr(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]

    registers[c] = firstValue
}

fun seti(a: Int, b: Int, c: Int, registers: Array<Int>) {
    registers[c] = a
}

fun gtrr(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]
    val secondValue = registers[b]
//    println("$firstValue $secondValue")

    registers[c] = if (firstValue > secondValue) 1 else 0
}

fun gtri(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]

    registers[c] = if (firstValue > b) 1 else 0
}

fun gtir(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val secondValue = registers[b]

    registers[c] = if (a > secondValue) 1 else 0
}

fun eqrr(a: Int, b: Int, c: Int, registers: Array<Int>) {
//    println("$firstRegister $secondRegister")
    val firstValue = registers[a]
    val secondValue = registers[b]
//    println("$firstValue $secondValue")

    registers[c] = if (firstValue == secondValue) 1 else 0
}

fun eqri(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val firstValue = registers[a]
//    println("$firstRegister")
//    println("$firstValue $b")

    registers[c] = if (firstValue == b) 1 else 0
}

fun eqir(a: Int, b: Int, c: Int, registers: Array<Int>) {
    val secondValue = registers[b]

    registers[c] = if (a == secondValue) 1 else 0
}


fun day16(input: List<String>): Int {
    val chunks = input.filter { line -> line.isNotBlank() }.chunked(3)
    val beforeRegex = "Before:\\s+\\[(\\d), (\\d), (\\d), (\\d)]".toRegex()
    val opDataRegex = "(\\d+) (\\d) (\\d) (\\d)".toRegex()
    val afterRegex = "After:\\s+ \\[(\\d), (\\d), (\\d), (\\d)]".toRegex()

    val greaterThanThreePossibles = mutableListOf<Int>()
    val dumbCounting = mutableMapOf<String, MutableMap<Int, Int>>()
    val dumbCounting2 = mutableMapOf<Int, MutableMap<String, Int>>()

    chunks.forEach { chunk ->
        val beforeMatch = beforeRegex.find(chunk[0]) ?: return@forEach

        val startRegisters = arrayOf(
            beforeMatch.groupValues[1].toInt(),
            beforeMatch.groupValues[2].toInt(),
            beforeMatch.groupValues[3].toInt(),
            beforeMatch.groupValues[4].toInt(),
        )
        val afterMatch = afterRegex.find(chunk[2])
        val afterRegisters = arrayOf(
            afterMatch!!.groupValues[1].toInt(),
            afterMatch.groupValues[2].toInt(),
            afterMatch.groupValues[3].toInt(),
            afterMatch.groupValues[4].toInt(),
        )
        val opDataMatch = opDataRegex.find(chunk[1])
        val opCode = opDataMatch!!.groupValues[1].toInt()
        val aVal = opDataMatch.groupValues[2].toInt()
        val bVal = opDataMatch.groupValues[3].toInt()
        val cVal = opDataMatch.groupValues[4].toInt()

//        println(startRegisters.contentToString())
//        println("$opCode $aVal $bVal $cVal")
//        println(afterRegisters.contentToString())

        val matching = mutableSetOf<String>()
//        if (listOf(2, 11, 0, 3, 13, 5, 7, 10, 14, 9, 15, 8, 12, 1).contains(opCode)) return@forEach

        val addrRegisters = startRegisters.clone();
        addr(aVal, bVal, cVal, addrRegisters)
        if (addrRegisters contentEquals afterRegisters) matching.add("addr")

        val addiRegisters = startRegisters.clone();
        addi(aVal, bVal, cVal, addiRegisters)
        if (addiRegisters contentEquals afterRegisters) matching.add("addi")

        val mulrRegisters = startRegisters.clone();
        mulr(aVal, bVal, cVal, mulrRegisters)
        if (mulrRegisters contentEquals afterRegisters) matching.add("mulr")

        val muliRegisters = startRegisters.clone();
        muli(aVal, bVal, cVal, muliRegisters)
        if (muliRegisters contentEquals afterRegisters) matching.add("muli")

        val banrRegisters = startRegisters.clone();
        banr(aVal, bVal, cVal, banrRegisters)
        if (banrRegisters contentEquals afterRegisters) matching.add("banr")

        val baniRegisters = startRegisters.clone();
        bani(aVal, bVal, cVal, baniRegisters)
        if (baniRegisters contentEquals afterRegisters) matching.add("bani")

        val borrRegisters = startRegisters.clone();
        borr(aVal, bVal, cVal, borrRegisters)
        if (borrRegisters contentEquals afterRegisters) matching.add("borr")

        val boriRegisters = startRegisters.clone();
        bori(aVal, bVal, cVal, boriRegisters)
        if (boriRegisters contentEquals afterRegisters) matching.add("bori")

        val setrRegisters = startRegisters.clone();
        setr(aVal, bVal, cVal, setrRegisters)
        if (setrRegisters contentEquals afterRegisters) matching.add("setr")

        val setiRegisters = startRegisters.clone();
        seti(aVal, bVal, cVal, setiRegisters)
        if (setiRegisters contentEquals afterRegisters) matching.add("seti")

        val gtrrRegisters = startRegisters.clone();
        gtrr(aVal, bVal, cVal, gtrrRegisters)
        if (gtrrRegisters contentEquals afterRegisters) matching.add("gtrr")

        val gtriRegisters = startRegisters.clone();
        gtri(aVal, bVal, cVal, gtriRegisters)
        if (gtriRegisters contentEquals afterRegisters) matching.add("gtri")

        val gtirRegisters = startRegisters.clone();
        gtir(aVal, bVal, cVal, gtirRegisters)
        if (gtirRegisters contentEquals afterRegisters) matching.add("gtir")

        val eqrrRegisters = startRegisters.clone();
        eqrr(aVal, bVal, cVal, eqrrRegisters)
        if (eqrrRegisters contentEquals afterRegisters) matching.add("eqrr")

        val eqriRegisters = startRegisters.clone();
        eqri(aVal, bVal, cVal, eqriRegisters)
        if (eqriRegisters contentEquals afterRegisters) matching.add("eqri")

        val eqirRegisters = startRegisters.clone();
        eqir(aVal, bVal, cVal, eqirRegisters)
        if (eqirRegisters contentEquals afterRegisters) matching.add("eqir")

//        println("$matching")
//        if (matching.size == 1) println("Opcode $opCode is $matching")
        matching.forEach { operation ->

            if (!dumbCounting.containsKey(operation)) {
                dumbCounting[operation] = mutableMapOf()
            }

            if (!dumbCounting2.containsKey(opCode)) {
                dumbCounting2[opCode] = mutableMapOf()
            }

            val innerMap = dumbCounting[operation]!!
            if (innerMap.containsKey(opCode)) {
                innerMap[opCode] = innerMap[opCode]!!.plus(1)
            } else {
                innerMap[opCode] = 1
            }

            val innerMap2 = dumbCounting2[opCode]!!
            if (innerMap2.containsKey(operation)) {
                innerMap2[operation] = innerMap2[operation]!!.plus(1)
            } else {
                innerMap2[operation] = 1
            }
        }
        if (matching.size >= 3) greaterThanThreePossibles.add(opCode)
    }

//    println(greaterThanThreePossibles)
//    println(dumbCounting)
//    println(dumbCounting2)
    return greaterThanThreePossibles.size;
}

fun day16Second(input: List<String>): Int {
    // borr - 0
    // seti - 1
    // mulr - 2
    // eqri - 3
    // banr - 4
    // bori - 5
    // bani - 6
    // gtri - 7
    // addr - 8
    // muli - 9
    // addi - 10
    // eqrr - 11
    // gtir - 12
    // eqir - 13
    // setr - 14
    // gtrr - 15
    val opDataRegex = "(\\d+) (\\d) (\\d) (\\d)".toRegex()
    val registers = arrayOf(0, 0, 0, 0)

    input.forEach {line ->
        val opDataMatch = opDataRegex.find(line)
        val opCode = opDataMatch!!.groupValues[1].toInt()
        val aVal = opDataMatch.groupValues[2].toInt()
        val bVal = opDataMatch.groupValues[3].toInt()
        val cVal = opDataMatch.groupValues[4].toInt()

        when(opCode) {
            0 -> borr(aVal, bVal, cVal, registers)
            1 -> seti(aVal, bVal, cVal, registers)
            2 -> mulr(aVal, bVal, cVal, registers)
            3 -> eqri(aVal, bVal, cVal, registers)
            4 -> banr(aVal, bVal, cVal, registers)
            5 -> bori(aVal, bVal, cVal, registers)
            6 -> bani(aVal, bVal, cVal, registers)
            7 -> gtri(aVal, bVal, cVal, registers)
            8 -> addr(aVal, bVal, cVal, registers)
            9 -> muli(aVal, bVal, cVal, registers)
            10 -> addi(aVal, bVal, cVal, registers)
            11 -> eqrr(aVal, bVal, cVal, registers)
            12 -> gtir(aVal, bVal, cVal, registers)
            13 -> eqir(aVal, bVal, cVal, registers)
            14 -> setr(aVal, bVal, cVal, registers)
            15 -> gtrr(aVal, bVal, cVal, registers)
        }
    }

    return registers[0]
}

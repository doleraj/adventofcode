package y2017

fun day8(input: Array<String>): Int {
    val regs = processInstructions(input)
    println(regs)
    return regs.maxBy({ entry -> entry.value.first })!!.value.first
}

fun day8Second(input: Array<String>): Int {
    val regs = processInstructions(input)
    println(regs)
    return regs.maxBy({ entry -> entry.value.second })!!.value.second
}

fun processInstructions(input: Array<String>): Map<String, Pair<Int, Int>> {
    val registers = mutableMapOf<String, Pair<Int, Int>>()
    val regex = Regex("^(\\w+) (inc|dec) (-?\\d+) if (\\w+) (<|<=|>|>=|==|!=) (-?\\d+)$")

    for (line in input) {
        val result = regex.find(line)
        if (result != null) {
            val groups = result.groups
            val register = groups[1]!!.value
            val op = groups[2]!!.value
            val operand = groups[3]!!.value.toInt()
            val conditionRegister = groups[4]!!.value
            val condition = groups[5]!!.value
            val conditionCheck = groups[6]!!.value.toInt()

            ensureRegisterExists(registers, register)
            ensureRegisterExists(registers, conditionRegister)

            if (performCheck(registers, conditionRegister, condition, conditionCheck)) {
                performOperation(registers, register, op, operand)
            } else {
//                println()
            }
        }
    }

    return registers
}

fun ensureRegisterExists(registers: MutableMap<String, Pair<Int, Int>>, register: String) {
    if (!registers.containsKey(register)) {
        registers[register] = Pair(0, 0)
    }
}

fun performCheck(registers: Map<String, Pair<Int, Int>>, conditionRegister: String, condition: String, conditionCheck: Int): Boolean {
//    print("Checking if " + conditionRegister + " " + condition + " " + conditionCheck + "... ")
    return when (condition) {
        "<" ->  registers[conditionRegister]!!.first < conditionCheck
        "<=" -> registers[conditionRegister]!!.first <= conditionCheck
        ">" ->  registers[conditionRegister]!!.first > conditionCheck
        ">=" -> registers[conditionRegister]!!.first >= conditionCheck
        "==" -> registers[conditionRegister]!!.first == conditionCheck
        "!=" -> registers[conditionRegister]!!.first != conditionCheck
        else -> {
            false
        }
    }
}

fun performOperation(registers: MutableMap<String, Pair<Int, Int>>, register: String, op: String, operand: Int) {
//    println(op + "-ing " + register + " by " + operand)
    var actualOperand = operand
    if (op == "dec") {
        actualOperand = -operand
    }

    val newVal = registers[register]!!.first + actualOperand
    val oldMax = registers[register]!!.second
    registers[register] = Pair(newVal, if ( newVal > oldMax ) newVal else oldMax)
//    println(registers)
}
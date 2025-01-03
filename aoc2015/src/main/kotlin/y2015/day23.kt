package y2015

val halfRegex = "hlf ([ab])".toRegex();
val tripleRegex = "tpl ([ab])".toRegex();
val incrementRegex = "inc ([ab])".toRegex();
val jumpRegex = "jmp .*".toRegex();
val jumpIfEvenRegex = "jie .*".toRegex();
val jumpIfOddRegex = "jio .*".toRegex();


interface Instruction {
    fun doIt(currentInstructionCounter:Int, registers: MutableMap<String, Int>): Int;
}

class Half (private val registerName: String): Instruction {
    override fun doIt(currentInstructionCounter: Int, registers: MutableMap<String, Int>): Int {
        registers[this.registerName] = registers[this.registerName]!! / 2;
        return currentInstructionCounter + 1;
    }
}

class Triple(private val registerName: String): Instruction {
    override fun doIt(currentInstructionCounter: Int, registers: MutableMap<String, Int>): Int {
        registers[this.registerName] = registers[this.registerName]!! * 3
        return currentInstructionCounter + 1;
    }
}

class Increment (private val registerName: String): Instruction {
    override fun doIt(currentInstructionCounter: Int, registers: MutableMap<String, Int>): Int {
        registers[this.registerName] = registers[this.registerName]!! + 1;
        return currentInstructionCounter + 1;
    }
}

class Jump (private val jumpDistance: Int): Instruction {
    override fun doIt(currentInstructionCounter: Int, registers: MutableMap<String, Int>): Int {
        return currentInstructionCounter + jumpDistance;
    }
}

class JumpIfEven (private val registerName: String, private val jumpDistance: Int): Instruction {
    override fun doIt(currentInstructionCounter: Int, registers: MutableMap<String, Int>): Int {
        return if (registers[this.registerName]!! % 2 == 0) {
            currentInstructionCounter + jumpDistance;
        } else {
            currentInstructionCounter + 1;
        }
    }
}

class JumpIfOdd (private val registerName: String, private val jumpDistance: Int): Instruction {
    override fun doIt(currentInstructionCounter: Int, registers: MutableMap<String, Int>): Int {
        return if (registers[this.registerName] == 1) {
            currentInstructionCounter + jumpDistance;
        } else {
            currentInstructionCounter + 1;
        }
    }
}

fun day23(input: String): Int {
    val lines = input.split("\n")
    val registers = mutableMapOf("a" to 0, "b" to 0)

    val instructions = mutableListOf<Instruction>()
    for (line in lines) {
        if (halfRegex.matches(line)) {
            instructions.add(Half(line.split(" ")[1]));
        } else if (tripleRegex.matches(line)) {
            instructions.add(Triple(line.split(" ")[1]))
        } else if (incrementRegex.matches(line)) {
            instructions.add(Increment(line.split(" ")[1]))
        } else if (jumpRegex.matches(line)) {
            instructions.add(Jump(line.split(" ")[1].toInt()));
        } else if (jumpIfEvenRegex.matches(line)) {
            val secondPart = line.substring(4).split(", ")
            instructions.add(JumpIfEven(secondPart[0], secondPart[1].toInt()));
        } else if (jumpIfOddRegex.matches(line)) {
            val secondPart = line.substring(4).split(", ")
            instructions.add(JumpIfOdd(secondPart[0], secondPart[1].toInt()));
        }
    }

    var instructionPointer = 0;
    while (instructionPointer < instructions.size) {
        instructionPointer = instructions[instructionPointer].doIt(instructionPointer, registers);
    }

    return registers["b"]!!;
}

fun day23Second(input: String): Int {
    val lines = input.split("\n")
    val registers = mutableMapOf("a" to 1, "b" to 0)

    val instructions = mutableListOf<Instruction>()
    for (line in lines) {
        if (halfRegex.matches(line)) {
            instructions.add(Half(line.split(" ")[1]));
        } else if (tripleRegex.matches(line)) {
            instructions.add(Triple(line.split(" ")[1]))
        } else if (incrementRegex.matches(line)) {
            instructions.add(Increment(line.split(" ")[1]))
        } else if (jumpRegex.matches(line)) {
            instructions.add(Jump(line.split(" ")[1].toInt()));
        } else if (jumpIfEvenRegex.matches(line)) {
            val secondPart = line.substring(4).split(", ")
            instructions.add(JumpIfEven(secondPart[0], secondPart[1].toInt()));
        } else if (jumpIfOddRegex.matches(line)) {
            val secondPart = line.substring(4).split(", ")
            instructions.add(JumpIfOdd(secondPart[0], secondPart[1].toInt()));
        }
    }

    var instructionPointer = 0;
    while (instructionPointer < instructions.size) {
        instructionPointer = instructions[instructionPointer].doIt(instructionPointer, registers);
    }

    return registers["b"]!!;
}

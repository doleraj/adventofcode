package y2018

fun day7(input: Array<String>): String {
    val instructions = getInstructions(input)

    var instructionOrder = ""
    while (instructions.isNotEmpty()) {
        val nextInstruction = instructions.entries
                .filter { entry -> !instructions.values.flatMap { instruction -> instruction.dependedOnBy }.toSet().contains(entry.key) }
                .sortedBy { entry -> entry.key }
                .first()


        instructionOrder += nextInstruction.key
        instructions.remove(nextInstruction.key)
    }
   return instructionOrder
}

fun day7Second(workerCount: Int, stepOffset: Int, input: Array<String>): Int {
    val instructions = getInstructions(input)

    val instructionOrder = mutableListOf<String>()
    val workers = (1..workerCount).map {
        i ->  Worker(i, ".", 0)
    }
    while (instructions.isNotEmpty()) {
        instructionOrder.add(workers.joinToString { worker ->
            pickInstructionOrWork(instructions, stepOffset, worker)
        })

        System.out.println("*****")

    }
    return instructionOrder.size - 1
}

fun pickInstructionOrWork(instructions: MutableMap<String, Instruction>, stepOffset: Int, worker: Worker): String {
    worker.secondsLeft--

    if (worker.secondsLeft > 0) {
        return ""
    }

    instructions.remove(worker.instruction)

    val instructionKey = instructions.entries
            .filterNot { entry -> instructions.values.flatMap { instruction -> instruction.dependedOnBy }.toSet().contains(entry.key) }
            .filterNot { entry -> entry.value.beingWorked }
            .sortedBy { entry -> entry.key }
            .firstOrNull()?.key ?: "."

    worker.instruction = instructionKey
    System.out.println("Worker ${worker.id} picked $instructionKey")
    return if (instructionKey == ".") {
        ""
    } else {
        worker.secondsLeft = stepOffset + (instructionKey.chars()!!.findFirst().asInt) - 64
        instructions[instructionKey]!!.beingWorked = true
        instructionKey
    }
}

val regex = "Step ([A-Z]) must be finished before step ([A-Z]) can begin.".toRegex()
fun getInstructions(input: Array<String>): MutableMap<String, Instruction> {
    val instructions = mutableMapOf<String, Instruction>()
    input
            .map {
                s -> val result = regex.find(s)!!; Pair(result.groups[1]!!.value, result.groups[2]!!.value)
            }
            .forEach { pair ->
                if (instructions[pair.first] == null) {
                    instructions[pair.first] = Instruction(pair.first, mutableListOf(), false)
                }
                instructions[pair.first]!!.dependedOnBy.add(pair.second)
            }

    val last = instructions.map {
            entry -> entry.value.dependedOnBy.filterNot {
                s -> instructions.keys.contains(s)
            }
        }.filter{list -> list.isNotEmpty() }.toSet().first().first()
    instructions[last] = Instruction(last, mutableListOf(), false)

    return instructions
}

class Worker(var id: Int, var instruction: String, var secondsLeft: Int) {
    override fun toString(): String {
        return "Worker(id=$id, instruction='$instruction', secondsLeft=$secondsLeft)"
    }
}

class Instruction(var id: String, var dependedOnBy: MutableList<String>, var beingWorked: Boolean = false)
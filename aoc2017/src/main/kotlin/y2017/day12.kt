package y2017

fun day12(input: List<String>): Int {
    val programMap = buildPrograms(input)
    val group = mutableSetOf<Program>()
    programMap[0]!!.collectConnections(group)
    return group.size
}

fun day12Second(input: List<String>): Int {
    val programMap = buildPrograms(input)
    val programGroups = mutableSetOf<Set<Program>>()
    for (program in programMap.values) {
        val group = mutableSetOf<Program>()
        program.collectConnections(group)
        programGroups.add(group)
    }
    return programGroups.size
}

fun buildPrograms(input: List<String>): Map<Int, Program> {
    val pattern = Regex("(\\d+) <-> ((:?\\d+(:?, )?)+)")
    val programMap = mutableMapOf<Int, Program>()
    for (line in input) {
        val result = pattern.matchEntire(line)!!
        val programId = result.groups[1]!!.value.toInt()
        val program = getOrCreateProgram(programId, programMap)

        val connections = result.groups[2]!!.value.split(", ")
        for (connection in connections) {
            getOrCreateProgram(connection.toInt(), programMap).addConnection(program)
        }
    }
    return programMap
}

fun getOrCreateProgram(programId: Int, programs: MutableMap<Int, Program>): Program {
    if (!programs.containsKey(programId)) {
        programs.put(programId, Program(programId))
    }
    return programs[programId]!!
}

class Program(val id: Int) {
    val connections: MutableSet<Program> = mutableSetOf()

    fun addConnection(program: Program) {
        connections.add(program)
        program.connections.add(this)
    }

    fun collectConnections(programSet: MutableSet<Program> = mutableSetOf()) {
        if (!programSet.contains(this)) {
            programSet.add(this)
        }

        /* We only add a program to the set once we've visited it, so if all the connections
        are in the set then we don't have anything to do. */
        for (program in connections.filter({program -> !programSet.contains(program)})) {
            program.collectConnections(programSet)
        }
    }
}
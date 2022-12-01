package y2017

fun day25(input: MutableList<String>): Int {
    val beginState = parseBeginState(input)
    val checksumAfter = parseChecksumStep(input)
    input.removeAt(0) // blank line

    val states = parseInstructions(input)

    val tape = Tape()
    var i = 0
    var currentState = states[beginState]!!
    while (i++ < checksumAfter) {
        currentState = states[currentState.checkTapeAndPerformAction(tape)]!!
    }
    return tape.checksum()
}

fun parseBeginState(input: MutableList<String>): String {
    val line = input.removeAt(0)
    val pattern = Regex("Begin in state (\\w).")
    return pattern.matchEntire(line)!!.groups[1]!!.value
}

fun parseChecksumStep(input: MutableList<String>): Long {
    val line = input.removeAt(0)
    val pattern = Regex("Perform a diagnostic y2017.checksum after (\\d+) steps.")
    return pattern.matchEntire(line)!!.groups[1]!!.value.toLong()
}

fun parseInstructions(input: MutableList<String>): Map<String, State> {
    val map = mutableMapOf<String, State>()
    val stateNamePattern = Regex("In state (\\w):")

    while (input.size > 0) {
        val stateNameLine = input.removeAt(0)
        val stateName = stateNamePattern.matchEntire(stateNameLine)!!.groups[1]!!.value

        val state = State(stateName)
        parseAndAddAction(state, input)
        parseAndAddAction(state, input)

        if (input.size > 0) {
            input.removeAt(0) // Ditch the blank line
        }
        map.put(stateName, state)
    }

    return map
}

fun parseAndAddAction(state: State, input: MutableList<String>) {
    val valCheckPattern = Regex("  If the current value is ([01]):")
    val writePattern = Regex("    - Write the value ([01]).")
    val movePattern = Regex("    - Move one slot to the (right|left).")
    val nextStatePattern = Regex("    - Continue with state (\\w).")

    val checkFor = valCheckPattern.matchEntire(input.removeAt(0))!!.groups[1]!!.value.toInt()
    val writeVal = writePattern.matchEntire(input.removeAt(0))!!.groups[1]!!.value.toInt()
    val nextDir = movePattern.matchEntire(input.removeAt(0))!!.groups[1]!!.value
    val nextState = nextStatePattern.matchEntire(input.removeAt(0))!!.groups[1]!!.value

    state.addAction(checkFor, Action(writeVal, TapeDirection.parse(nextDir), nextState))
}

class State(val name: String) {
    val actions = mutableMapOf<Int, Action>()

    fun addAction(triggerVal: Int, action: Action) {
        actions[triggerVal] = action
    }

    fun checkTapeAndPerformAction(tape: Tape): String {
        val action = actions[tape.getVal()]!!
        return action.performAction(tape)
    }

    override fun toString(): String {
        return "y2017.State(name='$name')"
    }

}

class Action(val writeVal: Int, val nextDir: TapeDirection, val nextState: String) {

    fun performAction(tape: Tape): String {
        tape.writeAndMove(writeVal, nextDir)
        return nextState
    }
}

enum class TapeDirection {
    RIGHT,
    LEFT;

    companion object {
        fun parse(text: String): TapeDirection {
            if (text == "right") {
                return RIGHT
            } else if (text == "left") {
                return LEFT
            }
             else {
                error("No direction for $text")
            }
        }
    }
}

class Tape {
    var location = 0
    val data = mutableMapOf(Pair(0, 0))

    fun getVal(): Int {
        var value = data[location]
        if (value == null) {
            data[location] = 0
            value = 0
        }
        return value
    }

    fun writeAndMove(writeVal: Int, direction: TapeDirection) {
        data[location] = writeVal
        if (direction == TapeDirection.RIGHT) {
            location++
        } else {
            location--
        }
    }

    fun checksum(): Int {
        return data.values.filter { i -> i == 1 }.count()
    }
}
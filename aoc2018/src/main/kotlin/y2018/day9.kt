package y2018

fun day9(playerCount: Int, marbleCount: Int): Int {
    var nextMarble = 0
    val players = mutableMapOf(*(1..playerCount).map { i -> Pair(i, 0) }.toTypedArray())
    val playerTurnIterator = generateSequence { players.keys }.flatten().take(marbleCount).iterator()

    val buffer = RingBuffer(nextMarble++)

    while (nextMarble <= marbleCount) {
        if (nextMarble % 100000 == 0) { System.out.println("$nextMarble of $marbleCount") }
        val playerId = playerTurnIterator.next()
        if (nextMarble % 23 == 0) {
            players[playerId] = nextMarble++ + players[playerId]!!
            players[playerId] = buffer.remove(7) + players[playerId]!!
//            System.out.println("Player $playerId has new score of ${players[playerId]}")
        } else {
            buffer.add(nextMarble++, 2)
        }
//        System.out.println(buffer)
    }

    return players.entries.sortedByDescending { entry -> entry.value }.first().value
}

class RingBuffer(initVal: Int)
{
    private val data = mutableListOf(initVal)
    var currentIndex = 0

    fun add(value: Int, clockwiseSteps: Int) {
        val nextIndex = (currentIndex + clockwiseSteps) % data.size
        currentIndex = if (nextIndex == 0) { data.size } else { nextIndex }
        data.add(currentIndex, value)
    }

    fun remove(counterclockwiseSteps: Int): Int {
        var nextIndex = (currentIndex - counterclockwiseSteps) % data.size
        if (nextIndex < 0) {
            nextIndex += data.size
        }
        currentIndex = if (nextIndex == 0) { data.size } else { nextIndex }
        return data.removeAt(nextIndex)
    }

    override fun toString(): String {
        return "RingBuffer(data=$data, currentIndex=$currentIndex)"
    }
}

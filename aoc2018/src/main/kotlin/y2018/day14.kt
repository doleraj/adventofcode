package y2018

fun day14(input: Int): String {
    val scoreboard = Scoreboard()
//    scoreboard.printScoreboard()
    var recipesCreated = 2
    var nextTenScores = ""
    while (nextTenScores.length < 10) {
        val newScores = scoreboard.calculateAndAdd()

        for (score in newScores) {
            if (recipesCreated >= input && nextTenScores.length < 10) {
                nextTenScores += score
                
            }
            recipesCreated++
        }
//        scoreboard.printScoreboard()
    }
    return nextTenScores;
}

fun day14Second(input: String): Int {
//    val scoreboard = Scoreboard()
////    scoreboard.printScoreboard()
//    var allRecipes = "37"
//    while (!allRecipes.contains(input)) {
//        val newScores = scoreboard.calculateAndAdd()
//
//        for (score in newScores) {
//            allRecipes += score
//        }
////        scoreboard.printScoreboard()
//    }
//    return allRecipes.indexOf(input)

    val stopList = input.split("").filter { char -> char != "" }.map { char -> Integer.parseInt(char) }
    return recipes { it.endsWith(stopList) }.size - stopList.size
}

class Scoreboard() {
    private val scoreboard = mutableListOf(3, 7)
    private var elf1Index = 0
    private var elf2Index = 1
    
    fun add(number: Int) {
        scoreboard.add(number)
    }
    
    fun calculateAndAdd(): List<Int> {
        val elf1Score = scoreboard[elf1Index]
        val elf2Score = scoreboard[elf2Index]
        val totalScore = elf1Score + elf2Score
        
        val newScores = if (totalScore < 10) {
            listOf(totalScore)
        } else {
            listOf(totalScore / 10, totalScore % 10)
        }
        scoreboard.addAll(newScores)

        // NOT + 1 because this is an index
        elf1Index = (elf1Index + elf1Score + 1) % scoreboard.size
        elf2Index = (elf2Index + elf2Score + 1) % scoreboard.size
        
        return newScores
    }
    
    fun printScoreboard() {
        for ((i, score) in scoreboard.withIndex()) {
            if (elf1Index == i) {
                print("($score)")
            } else if (elf2Index == i) {
                print("[$score]")
            } else {
                print(" $score ")
            }
        }
        println()
    }
}


private fun recipes(stopCondition: (List<Int>) -> Boolean): List<Int> {
    val history = mutableListOf(3, 7)
    var elf1 = 0
    var elf2 = 1
    var stop = false

    while (!stop) {
        val nextValue = history[elf1] + history[elf2]
        nextValue.asDigits().forEach {
            if (!stop) {
                history.add(it)
                stop = stopCondition(history)
            }
        }
        elf1 = (elf1 + history[elf1] + 1) % history.size
        elf2 = (elf2 + history[elf2] + 1) % history.size
    }
    return history
}

private fun Int.asDigits(): List<Int> =
    this.toString().map { it.toString().toInt() }

private fun List<Int>.endsWith(other: List<Int>): Boolean =
    if (this.size < other.size) false
    else this.slice(this.size - other.size until this.size) == other

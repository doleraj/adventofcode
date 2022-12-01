package y2017

import java.util.*

fun day14(input: String): Int {
    val grid = buildGrid(input)
    return grid.map({row -> row.count({ i -> i == 1})}).reduce({count, rowTotal -> count + rowTotal})
}

fun day14Second(input: String): Int {
    val grid = buildGrid(input)
    val groupGrid = buildGroupGrid(grid)
//    for (row in groupGrid.withIndex()) {
//        print("[")
//        for (cell in grid[row.index]) {
//            if (cell == 0) {
//                print(".., ")
//            } else {
//                print(String.format("%02d, ", cell))
//            }
//        }
//        println("]")
//        print("[")
//        for (cell in row.value.withIndex()) {
//            if (cell.value == 0) {
//                print("...., ")
//            } else {
//                print(String.format("%04d, ", cell.value))
//            }
//
//        }
//        println("]")
//    }

    val uniqueGroups = groupGrid.map({row -> setOf(*row)}).reduce({acc, row -> setOf(*acc.toTypedArray(), *row.toTypedArray())})
    return uniqueGroups.count() - 1
}

fun buildGrid(input: String): Array<Array<Int>> {
    val grid = Array(128, {_ -> arrayOf<Int>() })
    var rowIndex = 0
    while (rowIndex < 128) {
        val rowInput = input + "-" + rowIndex
        val knotHash = knotHash(rowInput)
        val hash = knotHash.map({
            char -> char.toString().toInt(16).toString(2).padStart(4, '0').toCharArray().map({ c -> c.toString().toInt() })
        }).reduce({ acc, bits -> listOf(*acc.toTypedArray(), *bits.toTypedArray())})
        grid[rowIndex++] = hash.toTypedArray()
    }

    return grid
}

fun buildGroupGrid(grid: Array<Array<Int>>): Array<Array<Int>> {

    var groupGrid = Array(128, {_ -> Array(128, {_ -> 0 })})
    var availableIds: Queue<Int> = LinkedList<Int>((1..9999).toList())

    for (row in grid.withIndex()) {
        val y = row.index
        for (cell in row.value.withIndex()) {
            val x = cell.index

            if (cell.value == 0) {
                continue
            }

            var leftNeighborGroup = 0
            var topNeighborGroup = 0
            var cellGroup = groupGrid[y][x]

            if (x > 0) {
                leftNeighborGroup = groupGrid[y][x - 1]
            }
            if (y > 0) {
                topNeighborGroup = groupGrid[y - 1][x]
            }

            if (leftNeighborGroup == 0 && topNeighborGroup == 0) {
                cellGroup = availableIds.remove()
            } else if (leftNeighborGroup != 0 && topNeighborGroup == 0) {
                cellGroup = leftNeighborGroup
            } else if (topNeighborGroup != 0 && leftNeighborGroup == 0) {
                cellGroup = topNeighborGroup
            } else if (topNeighborGroup != leftNeighborGroup) {
                val winningGroup = Math.min(topNeighborGroup, leftNeighborGroup)
                val losingGroup = Math.max(topNeighborGroup, leftNeighborGroup)
//                    println("Merging " + losingGroup + " into " + winningGroup)
                groupGrid = replaceGroupInGrid(losingGroup, winningGroup, groupGrid)
                cellGroup = winningGroup
                availableIds.add(losingGroup)
                availableIds = LinkedList<Int>(availableIds.toSortedSet())

            } else if (topNeighborGroup == leftNeighborGroup) {
                cellGroup = topNeighborGroup
            }

            groupGrid[y][x] = cellGroup
        }
    }
    return groupGrid
}

fun replaceGroupInGrid(groupToReplace: Int, groupToReplaceWith: Int, groupGrid: Array<Array<Int>>): Array<Array<Int>> {

    return groupGrid.map({ row -> row.map({ cell -> if (cell == groupToReplace) groupToReplaceWith else cell }).toTypedArray() }).toTypedArray()
}


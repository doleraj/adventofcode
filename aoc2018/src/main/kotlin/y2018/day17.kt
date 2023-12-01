package y2018

import java.util.Vector

fun day17(input: List<String>): Int {
    var globalMaxY = 0;
    var globalMinX = 1000;
    var globalMaxX = 0;
    val xFirstRegex = "x=(\\d+), y=(\\d+)..(\\d+)".toRegex()
    val yFirstRegex = "y=(\\d+), x=(\\d+)..(\\d+)".toRegex()

    var stonePoints = input.map { line ->
        val newPoints = mutableListOf<Vector2D>()

        if (line.startsWith("x")) {
            val match = xFirstRegex.find(line)!!
            val x = match.groupValues[1].toInt()
            val y1 = match.groupValues[2].toInt()
            val y2 = match.groupValues[3].toInt()
            val minY = if (y1 > y2) y2 else y1
            val maxY = if (y1 > y2) y1 else y2
            if (maxY > globalMaxY) globalMaxY = maxY
            if (x > globalMaxX) globalMaxX = x
            if (x < globalMinX) globalMinX = x

            for (i in minY..maxY) {
                newPoints.add(Vector2D(x, i))
            }
        } else {
            val match = yFirstRegex.find(line)!!
            val y = match.groupValues[1].toInt()
            val x1 = match.groupValues[2].toInt()
            val x2 = match.groupValues[3].toInt()
            val minX = if (x1 > x2) x2 else x1
            val maxX = if (x1 > x2) x1 else x2
            if (maxX > globalMaxX) globalMaxX = maxX
            if (minX < globalMinX) globalMinX = minX
            if (y > globalMaxY) globalMaxY = y

            for (i in minX..maxX) {
                newPoints.add(Vector2D(i, y))
            }
        }

        return@map newPoints;
    }.flatten()

//    print("$globalMinX -> $globalMaxX, $globalMaxY")
//    println(stonePoints)



    val waterTouched = mutableSetOf<Vector2D>()
    val water = mutableSetOf<Vector2D>()
    var iterations = 0
    val maxIterations = 15

    while (iterations < maxIterations) {
        var currentSand = Vector2D(500, 0)
        var waterAtRest = false;
        val waterTouchedThisRound = mutableSetOf<Vector2D>()
        var cantGoDown = false

        while (!waterAtRest) {
            val downVec = currentSand.plus(Vector2D(0, 1))
            val downLeftVec = currentSand.plus(Vector2D(-1, 1))
            val downRightVec = currentSand.plus(Vector2D(1, 1))
            val leftVec = currentSand.plus(Vector2D(-1, 0))
            val rightVec = currentSand.plus(Vector2D(1, 0))

            if (!stonePoints.contains(downVec) && !water.contains(downVec)) {
                // Moving down
                currentSand = downVec
            } else if (!stonePoints.contains(downLeftVec) && !water.contains(downLeftVec)) {
                // Moving down left
                cantGoDown = false
                currentSand = downLeftVec
            } else if (!stonePoints.contains(downRightVec) && !water.contains(downRightVec)) {
                // Moving down right
                cantGoDown = false
                currentSand = downRightVec
            } else if (!stonePoints.contains(leftVec) && !water.contains(leftVec) && !waterTouchedThisRound.contains(leftVec)) {
                // Moving left first
//
                // seek right until you find a corner. If you don't, force the water right. If you do, leave it on the left.
                var cornerFound = false
                var edgeFound = false
                var tempPos = currentSand
                while (!cornerFound && !edgeFound) {

                    val stoneOrWaterBelow = stonePoints.contains(tempPos.plus(Vector2D(0, 1))) || water.contains(tempPos.plus(Vector2D(0, 1)))
//                    println(stoneOrWaterBelow)
                    val stoneOrWaterBeside = stonePoints.contains(tempPos.plus(Vector2D(1, 0))) || water.contains(tempPos.plus(Vector2D(1, 0)))
//                    println(stoneOrWaterBeside)
                    val stoneOrWaterDownRight = stonePoints.contains(tempPos.plus(Vector2D(1, 1))) || water.contains(tempPos.plus(Vector2D(1, 1)))
                    cornerFound = stoneOrWaterBelow && stoneOrWaterBeside
                    edgeFound = !cornerFound && !stoneOrWaterDownRight

                    tempPos = tempPos.plus(Vector2D(1, 0))
                }

                currentSand = if (edgeFound) {
//                    println("found an edge, moving right")
                    rightVec
                } else {
//                    println("Moving left")
                    leftVec
                }
//                currentSand = leftVec
            } else if (!stonePoints.contains(rightVec) && !water.contains(rightVec) && !waterTouchedThisRound.contains(rightVec)) {
//                cantGoDown = false
                // Moving right
                currentSand = rightVec
//
//
//

//            } else if (!stonePoints.contains(leftVec) && !water.contains(leftVec)) {
//                // Moving left
//                cantGoDown = true
//                currentSand = leftVec
//            } else if (!stonePoints.contains(rightVec) && !water.contains(rightVec)) {
//                cantGoDown = true
//                // Moving right
//                currentSand = rightVec
            } else if (!cantGoDown) {

                // Before it goes to rest we need to range backward

                water.add(currentSand)
                waterAtRest = true;
            } else {
                println("?????")
                return -1
            }
            waterTouchedThisRound.add(currentSand)
        }
        waterTouched.addAll(waterTouchedThisRound)
        iterations++
    }

    for (y in 0..globalMaxY) {
        for (x in globalMinX - 1 ..globalMaxX + 1) {
            if (stonePoints.contains(Vector2D(x, y))) print("#")
            else if (water.contains(Vector2D(x, y))) print("~")
            else if (waterTouched.contains(Vector2D(x, y))) print("|")
            else if (x == 500 && y == 0) print("+")
            else print(".")
        }
        println()
    }

    return waterTouched.size;
}

fun day17Second(input: List<String>): Int {
    return -1;
}

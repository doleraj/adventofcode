package y2017

fun day22(bursts: Int, input: List<String>): Int {

    val map = parseInitialGrid(input)
    var burst = 0
    var infectionBursts = 0
    var carrierX = 0
    var carrierY = 0
    var carrierFacing: MapDirection = MapDirection.UP
    while (burst++ < bursts) {
        if (map[carrierY] == null) {
            map[carrierY] = mutableMapOf()
        }
        val row = map[carrierY]!!

        if (row[carrierX] == '#') {
//            println("Facing $carrierFacing, turning right")
            carrierFacing = carrierFacing.turnRight()
//            println("now at $carrierFacing")
            row[carrierX] = '.'
        } else {
            infectionBursts++
//            println("INFECTION")
//            println("Facing $carrierFacing, turning left")
            carrierFacing = carrierFacing.turnLeft()
//            println("now at $carrierFacing")
            row[carrierX] = '#'
        }

        val next = carrierFacing.getNextCoordinates(carrierX, carrierY)
        carrierX = next.first
        carrierY = next.second
//        println("now at " + carrierX + " " + carrierY)
//        println(map)
    }
    return infectionBursts
}

fun day22Second(bursts: Int, input: List<String>): Int {

    val map = parseInitialGrid(input)
    var burst = 0
    var infectionBursts = 0
    var carrierX = 0
    var carrierY = 0
    var carrierFacing: MapDirection = MapDirection.UP
    while (burst++ < bursts) {
        if (map[carrierY] == null) {
            map[carrierY] = mutableMapOf()
        }
        val row = map[carrierY]!!

        if (row[carrierX] == 'F') {
            row[carrierX] = '.'
            carrierFacing = carrierFacing.turnLeft().turnLeft()
        } else if (row[carrierX] == 'W') {
            infectionBursts++
            row[carrierX] = '#'
        } else if (row[carrierX] == '#') {
            carrierFacing = carrierFacing.turnRight()
            row[carrierX] = 'F'
        } else {
            carrierFacing = carrierFacing.turnLeft()
            row[carrierX] = 'W'
        }

        val next = carrierFacing.getNextCoordinates(carrierX, carrierY)
//        println("Set $carrierX, $carrierY to " + row[carrierX])
        carrierX = next.first
        carrierY = next.second
//        println("now at " + carrierX + " " + carrierY)
//        println(map)
    }
    return infectionBursts
}


fun parseInitialGrid(input: List<String>): MutableMap<Int, MutableMap<Int, Char>> {
    val map = mutableMapOf<Int, MutableMap<Int, Char>>()
    val halfSize = (input[0].length / 2)
    var y = -halfSize
    for (line in input) {
        map[y] = mutableMapOf()
        var x = -halfSize
        for (char in line.toCharArray()) {
            map[y]!![x++] = char
        }
        y++
    }

    return map
}

enum class MapDirection {
    UP {
        override fun turnLeft(): MapDirection {
            return LEFT
        }

        override fun turnRight(): MapDirection {
            return RIGHT
        }

        override fun getNextCoordinates(x: Int, y: Int): Pair<Int, Int> {
            return Pair(x, y - 1)
        }
    },
    LEFT {
        override fun turnLeft(): MapDirection {
            return DOWN
        }

        override fun turnRight(): MapDirection {
            return UP
        }

        override fun getNextCoordinates(x: Int, y: Int): Pair<Int, Int> {
            return Pair(x - 1, y)
        }
    },
    RIGHT {
        override fun turnLeft(): MapDirection {
            return UP
        }

        override fun turnRight(): MapDirection {
            return DOWN
        }

        override fun getNextCoordinates(x: Int, y: Int): Pair<Int, Int> {
            return Pair(x + 1, y)
        }
    },
    DOWN {
        override fun turnLeft(): MapDirection {
            return RIGHT
        }

        override fun turnRight(): MapDirection {
            return LEFT
        }

        override fun getNextCoordinates(x: Int, y: Int): Pair<Int, Int> {
            return Pair(x, y + 1)
        }
    };

    abstract fun turnLeft(): MapDirection
    abstract fun turnRight(): MapDirection
    abstract fun getNextCoordinates(x: Int, y: Int): Pair<Int, Int>
}
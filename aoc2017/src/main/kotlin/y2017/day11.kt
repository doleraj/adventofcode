package y2017

fun day11(input: String): Pair<Int, Int> {
    val directions = input.split(",")

    var currentHex = HexNode(0, 0)
    var maxDist = 0
    for (dirString in directions) {
        val dir = Direction.parse(dirString)
        currentHex = currentHex.walk(dir)
        maxDist = Math.max(maxDist, currentHex.distanceFromOrigin())
    }

    return Pair(currentHex.distanceFromOrigin(), maxDist)
}

enum class Direction {
    NORTH {
        override fun reverse(): Direction {
            return SOUTH
        }

        override fun getNextCoordinates(q: Int, r: Int): Pair<Int, Int> {
            return Pair(q, r - 1)
        }
    },
    NORTHEAST {
        override fun reverse(): Direction {
            return SOUTHWEST
        }

        override fun getNextCoordinates(q: Int, r: Int): Pair<Int, Int> {
            return Pair(q + 1, r - 1)
        }
    },
    SOUTHEAST {
        override fun reverse(): Direction {
            return NORTHWEST
        }

        override fun getNextCoordinates(q: Int, r: Int): Pair<Int, Int> {
            return Pair(q + 1, r)
        }
    },
    SOUTH {
        override fun reverse(): Direction {
            return NORTH
        }

        override fun getNextCoordinates(q: Int, r: Int): Pair<Int, Int> {
            return Pair(q, r + 1)
        }
    },
    SOUTHWEST {
        override fun reverse(): Direction {
            return NORTHEAST
        }

        override fun getNextCoordinates(q: Int, r: Int): Pair<Int, Int> {
            return Pair(q - 1, r + 1)
        }
    },
    NORTHWEST {
        override fun reverse(): Direction {
            return SOUTHEAST
        }

        override fun getNextCoordinates(q: Int, r: Int): Pair<Int, Int> {
            return Pair(q - 1, r)
        }
    };

    abstract fun reverse(): Direction
    abstract fun getNextCoordinates(q: Int, r: Int): Pair<Int, Int>
    companion object {
        fun parse(input: String): Direction {
            return when (input) {
                "n" -> NORTH
                "ne" -> NORTHEAST
                "se" -> SOUTHEAST
                "s" -> SOUTH
                "sw" -> SOUTHWEST
                "nw" -> NORTHWEST
                else -> {
                    NORTH
                }
            }
        }
    }
}

class HexNode(val q: Int, val r: Int) {
    private val neighbors: MutableMap<Direction, HexNode> = mutableMapOf()

    fun walk(dir: Direction): HexNode {
        var nextHex = neighbors[dir]

        if (nextHex == null) {
            val coords = dir.getNextCoordinates(q, r)
            nextHex = HexNode(coords.first, coords.second)
            neighbors[dir] = nextHex
            nextHex.neighbors[dir.reverse()] = this
        }

        return nextHex
    }

    fun distanceFromOrigin(): Int {
        return (Math.abs(q - 0) + Math.abs(q + r - 0 - 0) + Math.abs(r - 0)) / 2
    }
}
package y2018

fun day13(input: List<String>): Pair<Int, Int> {

    val grid = Grid(input.size, input[0].length)
    grid.loadGrid(input)
//    grid.printGrid()

    var collisionLocations: ArrayList<Pair<Int, Int>> = ArrayList()

    var ticks = 0
    while (collisionLocations.size == 0 && ticks < 500) {
        collisionLocations = grid.moveCarts()
//        grid.printGrid()
        ticks++
    }
    
    return collisionLocations[0]
}

fun day13Second(input: List<String>): Pair<Int, Int> {

    val grid = Grid(input.size, input[0].length)
    grid.loadGrid(input)
//    grid.printGrid()
    
    var ticks = 0
    while (grid.cartCount() != 1) {
        var collisionLocations: ArrayList<Pair<Int, Int>> = ArrayList()
        while (collisionLocations.size == 0 && ticks < 1000000) {
            collisionLocations = grid.moveCarts()
//                    grid.printGrid()
            ticks++
            if (ticks % 100000000 == 0) {
                println(ticks)
            }
        }
        println(collisionLocations)
        grid.removeCartsAt(collisionLocations)
    }

    return grid.lastLocation()
}

enum class Direction {
    N,
    E,
    S,
    W
}

class Grid(xSize: Int, ySize: Int) {
    private var grid = Array(xSize) { _ -> Array(ySize) { _ -> "" } }
    private var carts = ArrayList<Cart>()

    fun loadGrid (input: List<String>) {
        for ((x, line) in input.withIndex()) {
            if (line.trim() == "") {
                continue
            }

            for ((y, char) in line.withIndex()) {
                grid[x][y] = when (char) {
                    'v' -> {
                        carts.add(Cart(Pair(x, y), Direction.S))
                        "|"
                    }
                    '^' -> {
                        carts.add(Cart(Pair(x, y), Direction.N))
                        "|"
                    }
                    '<' -> {
                        carts.add(Cart(Pair(x, y), Direction.W))
                        "-"
                    }
                    '>' -> {
                        carts.add(Cart(Pair(x, y), Direction.E))
                        "-"
                    }
                    else -> char.toString()
                }
            }
        }
        println (carts.size)
    }

    fun moveCarts(): ArrayList<Pair<Int, Int>> {
        carts.sort();
        val locationsUsed = ArrayList<Pair<Int, Int>>()
        val collisionLocations = ArrayList<Pair<Int, Int>>()
        for (cart in carts) {
            val nextLocation = findNextCartLocation(cart.location.first, cart.location.second, cart.facing)

//            println("Cart (${cartSymbol(cart)}) is at (${cart.location.first}, ${cart.location.second }). It will next be at (${nextLocation.first}, ${nextLocation.second})")
            
            cart.location = nextLocation
            if (locationsUsed.contains(nextLocation)) {
                collisionLocations.add(nextLocation)
            }
            locationsUsed.add(nextLocation)

            assignNextFacing(cart)
        }
        return collisionLocations
    }

    fun isIntersection(x: Int, y: Int): Boolean {
        return grid[x][y] == "+";
    }

    fun assignNextFacing(cart: Cart) {
        val x  = cart.location.first
        val y  = cart.location.second
        if (isIntersection(x, y)) {
            val newDirection = when (cart.turnCount % 3) {
                0 -> when (cart.facing) {
                    Direction.N -> Direction.W
                    Direction.E -> Direction.N
                    Direction.W -> Direction.S
                    Direction.S -> Direction.E
                }
                1 -> cart.facing
                2 -> when (cart.facing) {
                    Direction.N -> Direction.E
                    Direction.E -> Direction.S
                    Direction.W -> Direction.N
                    Direction.S -> Direction.W
                }
                else -> { throw Error ("Math is broken???")}
            }
            cart.turnCount++
            cart.facing = newDirection
            return
        }

        val newDirection = if (grid[x][y] == "\\") {
            when (cart.facing) {
                Direction.N -> Direction.W
                Direction.E -> Direction.S
                Direction.W -> Direction.N
                Direction.S -> Direction.E
            }
        } else if (grid[x][y] == "/") {
            when (cart.facing) {
                Direction.N -> Direction.E
                Direction.E -> Direction.N
                Direction.W -> Direction.S
                Direction.S -> Direction.W
            }
        } else {
            cart.facing
        }

        cart.facing = newDirection
    }

    private fun findNextCartLocation(x: Int, y: Int, facing: Direction): Pair<Int, Int> {
        return when(facing) {
            Direction.N -> Pair(x - 1, y)
            Direction.E -> Pair(x, y + 1)
            Direction.S -> Pair(x + 1, y)
            Direction.W -> Pair(x, y - 1)
        }
    }
    
    fun removeCartsAt(locations: List<Pair<Int, Int>>) {
        carts.removeAll { cart -> locations.contains(cart.location) }
        println(carts.size)
    }
    
    fun cartCount(): Int {
        return carts.size
    }
    
    fun lastLocation(): Pair<Int, Int> {
        println(carts)
        return carts[0].location
    }
    
    fun cartSymbol(cart: Cart): String{
        return when (cart.facing) {
            Direction.N -> "^"
            Direction.E -> ">"
            Direction.S -> "v"
            Direction.W -> "<"
        }
    }

    fun printGrid() {
        for ((x, line) in grid.withIndex()) {
            for ((y, symbol) in line.withIndex()) {
                val foundCart = carts.find { cart -> cart.location == Pair(x, y) }
                if (foundCart != null) {
                    print(cartSymbol(foundCart))
                } else {
                    print(symbol)
                }
            }
            println("")
        }
    }
}

class Cart(var location: Pair<Int, Int>, var facing: Direction): Comparable<Cart> {
    var turnCount = 0
    override fun toString(): String {
        return "Cart(x=${location.first}, y=${location.second}, facing=$facing)"
    }
    
    override fun compareTo(other: Cart): Int {
        return if (location.first > other.location.first) {
            -1;
        } else if (location.first == other.location.first) {
            if (location.second > other.location.second) {
                -1;
            } else if (location.second < other.location.second) {
                1;
            } else {
                0;
            }
        } else {
            1;
        }
    }
}

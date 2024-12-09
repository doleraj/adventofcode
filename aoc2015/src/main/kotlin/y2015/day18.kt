package y2015

fun printGrid(grid: Map<Int, Map<Int, Int>>) {
    for (y in 0..< grid.size) {
        for (x in 0..< grid[0]!!.size) {
            if (grid[y]!![x]!! == 1) {
                print("#")
            } else {
                print(".")
            }
        }
        println()
    }
}

fun tick(grid: Map<Int, Map<Int, Int>>): Map<Int, Map<Int, Int>> {
    val maxY = grid.size - 1;
    val maxX = grid[0]!!.size - 1;

    val newGrid = mutableMapOf<Int, MutableMap<Int, Int>>();
    for (y in 0..< grid.size) {
        newGrid[y] = mutableMapOf();
        for (x in 0..< grid[0]!!.size) {

            var neighborCount = 0;
            // Up
            if (y - 1 >= 0) {
                neighborCount += grid[y - 1]!![x]!!;
            }
            // Up Right
            if (y - 1 >= 0 && x + 1 <= maxX) {
                neighborCount += grid[y - 1]!![x + 1]!!
            }
            // Right
            if (x + 1 <= maxX) {
                neighborCount += grid[y]!![x + 1]!!
            }
            // Down Right
            if (y + 1 <= maxY && x + 1 <= maxX) {
                neighborCount += grid[y + 1]!![x + 1]!!
            }
            // Down
            if (y + 1 <= maxY) {
                neighborCount += grid[y + 1]!![x]!!
            }
            // Down Left
            if (y + 1 <= maxY && x - 1 >= 0) {
                neighborCount += grid[y + 1]!![x - 1]!!
            }
            // Left
            if (x - 1 >= 0) {
                neighborCount += grid[y]!![x - 1]!!
            }
            // Up Left
            if (y - 1 >= 0 && x - 1 >= 0) {
                neighborCount += grid[y - 1]!![x - 1]!!
            }

            if (grid[y]!![x]!! == 1) {
                if (neighborCount < 2 || neighborCount > 3) {
                    newGrid[y]!![x] = 0;
                } else {
                    newGrid[y]!![x] = 1;
                }
            } else {
                if (neighborCount == 3) {
                    newGrid[y]!![x] = 1;
                } else {
                    newGrid[y]!![x] = 0;
                }
            }
        }
    }

    return newGrid;
}


fun day18(ticks: Int, input: List<String>): Int {
    val chars = input.map { line -> line.trim().split("").subList(1, line.length + 1) };
    val grid = mutableMapOf<Int, MutableMap<Int, Int>>();

    for (y in chars.indices) {
        grid[y] = mutableMapOf();
        for (x in 0..< chars[0].size) {
            grid[y]!![x] = if (chars[y][x] == "#") 1 else 0;
        }
    }

//    printGrid(grid);
    var nextGrid: Map<Int, Map<Int, Int>> = grid;
    for (i in 0..< ticks) {
        nextGrid = tick(nextGrid);
    }
//    printGrid(nextGrid);

    return nextGrid.values.map { line -> line.values.sum() }.sum();
}

fun tick2(grid: Map<Int, Map<Int, Int>>): Map<Int, Map<Int, Int>> {
    val maxY = grid.size - 1;
    val maxX = grid[0]!!.size - 1;

    val newGrid = mutableMapOf<Int, MutableMap<Int, Int>>();
    for (y in 0..< grid.size) {
        newGrid[y] = mutableMapOf();
        for (x in 0..< grid[0]!!.size) {

            var neighborCount = 0;
            // Up
            if (y - 1 >= 0) {
                neighborCount += grid[y - 1]!![x]!!;
            }
            // Up Right
            if (y - 1 >= 0 && x + 1 <= maxX) {
                neighborCount += grid[y - 1]!![x + 1]!!
            }
            // Right
            if (x + 1 <= maxX) {
                neighborCount += grid[y]!![x + 1]!!
            }
            // Down Right
            if (y + 1 <= maxY && x + 1 <= maxX) {
                neighborCount += grid[y + 1]!![x + 1]!!
            }
            // Down
            if (y + 1 <= maxY) {
                neighborCount += grid[y + 1]!![x]!!
            }
            // Down Left
            if (y + 1 <= maxY && x - 1 >= 0) {
                neighborCount += grid[y + 1]!![x - 1]!!
            }
            // Left
            if (x - 1 >= 0) {
                neighborCount += grid[y]!![x - 1]!!
            }
            // Up Left
            if (y - 1 >= 0 && x - 1 >= 0) {
                neighborCount += grid[y - 1]!![x - 1]!!
            }

            if ((y == 0 && x == 0) || (y == 0 && x == maxX) || (y == maxY && x == maxX) || (y == maxY && x == 0)) {
                newGrid[y]!![x] = 1;
            } else if (grid[y]!![x]!! == 1) {
                if (neighborCount < 2 || neighborCount > 3) {
                    newGrid[y]!![x] = 0;
                } else {
                    newGrid[y]!![x] = 1;
                }
            } else {
                if (neighborCount == 3) {
                    newGrid[y]!![x] = 1;
                } else {
                    newGrid[y]!![x] = 0;
                }
            }
        }
    }

    return newGrid;
}

fun day18Second(ticks: Int, input: List<String>): Int {
    val chars = input.map { line -> line.trim().split("").subList(1, line.length + 1) };
    val grid = mutableMapOf<Int, MutableMap<Int, Int>>();

    for (y in chars.indices) {
        grid[y] = mutableMapOf();
        for (x in 0..< chars[0].size) {
            grid[y]!![x] = if (chars[y][x] == "#") 1 else 0;
        }
    }
    grid[0]!![0] = 1;
    grid[chars.size - 1]!![0] = 1;
    grid[0]!![chars[0].size - 1] = 1;
    grid[chars.size - 1]!![chars[0].size - 1] = 1;

//    printGrid(grid);
    var nextGrid: Map<Int, Map<Int, Int>> = grid;
    for (i in 0..< ticks) {
        nextGrid = tick2(nextGrid);
    }
    println()
//    printGrid(nextGrid);

    return nextGrid.values.map { line -> line.values.sum() }.sum();
}

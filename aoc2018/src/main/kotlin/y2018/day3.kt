package y2018

fun day3(input: Array<String>): Int {
    val boxes = getBoxes(input)
    val checked = mutableSetOf<Pair<Int, Int>>()

    val intersectingCells = mutableSetOf<Pair<Int, Int>>()
    for (box in boxes) {
        for (otherBox in boxes) {
            if (box.id == otherBox.id || checked.contains(Pair(box.id, otherBox.id))) {
                continue
            }
            val foo = box.cells
            val bar = otherBox.cells
            val cells = foo.intersect(bar)

            intersectingCells.addAll(cells)
            checked.add(Pair(box.id, otherBox.id))
            checked.add(Pair(otherBox.id, box.id))
        }

    }
    return intersectingCells.size
}

fun getBoxes(input: Array<String>): MutableList<BoundingBox> {
    val boxes = mutableListOf<BoundingBox>()
    val regex = Regex("^#(\\d+) @ (\\d+),(\\d+): (\\d+)x(\\d+)$")

    for (line in input) {
        val result = regex.find(line)
        if (result != null) {
            val groups = result.groups
            val areaId = groups[1]!!.value.toInt()
            val left = groups[2]!!.value.toInt()
            val upper = groups[3]!!.value.toInt()
            val width = groups[4]!!.value.toInt()
            val height = groups[5]!!.value.toInt()
            boxes.add(BoundingBox(areaId, upper, left, height,  width))
        }
    }
    return boxes
}

fun day3Second(input: Array<String>): Int {
    val boxes = getBoxes(input)
    val checked = mutableSetOf<Pair<Int, Int>>()

    val intersectingCells = mutableSetOf<Pair<Int, Int>>()
    val boxHadIntersectionMap = mutableMapOf<Int, Boolean>()
    for (box in boxes) {
        for (otherBox in boxes) {
            if (box.id == otherBox.id || checked.contains(Pair(box.id, otherBox.id))) {
                continue
            }
            val foo = box.cells
            val bar = otherBox.cells
            val cells = foo.intersect(bar)

            if (cells.isNotEmpty()) {
                boxHadIntersectionMap[box.id] = true
                boxHadIntersectionMap[otherBox.id] = true
            }
            intersectingCells.addAll(cells)
            checked.add(Pair(box.id, otherBox.id))
            checked.add(Pair(otherBox.id, box.id))
        }

    }
    return (1..1323).filter { i -> !boxHadIntersectionMap.containsKey(i) }.first()
}

class BoundingBox(val id: Int, val upper: Int, val left: Int, val height: Int, val width: Int) {
    val cells = calcCells()

    fun calcCells() : Set<Pair<Int, Int>> {
        val cells = mutableSetOf<Pair<Int, Int>>()
        for (cellHoriz in (left until left + width)) {
            for (cellVert in (upper until upper + height)) {
                cells.add(Pair(cellHoriz, cellVert))
            }
        }
        return cells;
    }
}

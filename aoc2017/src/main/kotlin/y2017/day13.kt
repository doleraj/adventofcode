package y2017

fun day13(input: List<String>): Int {
    val layers = buildFirewall(input)
    return checkSeverity(layers) - 1
}

fun day13Second(input: List<String>): Int {
    val layers = buildFirewall(input)

    var delay = 0
//    y2017.printLayers(layers)
    var success = bailIfSeverity(layers)
    while (!success) {
        delay++
        updateScanners(layers)
//        y2017.printLayers(layers)
        success = bailIfSeverity(layers)
//        if (delay % 5000 == 0) println(delay)
    }
    return delay
}

fun bailIfSeverity(layers: Map<Int, Layer>): Boolean {
    val safeLayers = copy(layers)
    var packetLayerIndex = 0
    while (packetLayerIndex <= safeLayers.keys.max()!!) {
        // Update packet position and check for collision
        val packetLayer = safeLayers[packetLayerIndex++]
        if (packetLayer != null) {
            if (packetLayer.getSeverityChange() > 0) return false
//            println("new severity total: " + totalSeverity)
        }

        // Update scanner position; don't check for collision
        updateScanners(safeLayers)
    }

    return true
}

fun checkSeverity(layers: Map<Int, Layer>): Int {
    val safeLayers = copy(layers)
    var totalSeverity = 0
    var packetLayerIndex = 0
    while (packetLayerIndex <= safeLayers.keys.max()!!) {
        // Update packet position and check for collision
        val packetLayer = safeLayers[packetLayerIndex++]
        if (packetLayer != null) {
            totalSeverity += packetLayer.getSeverityChange()
//            println("new severity total: " + totalSeverity)
        }

        // Update scanner position; don't check for collision
        updateScanners(safeLayers)
    }

    return totalSeverity
}

fun copy(layers: Map<Int, Layer>): Map<Int, Layer> {
    val newMap = mutableMapOf<Int, Layer>()
    for (entry in layers) {
        newMap.put(entry.key, entry.value.copy())
    }
    return newMap
}

fun updateScanners(layers: Map<Int, Layer>) {
    for (entry in layers) {
        entry.value.moveScanner()
    }
//    y2017.printLayers(layers)
}

fun printLayers(layers: Map<Int, Layer>) {
    for (entry in layers) {
        print(entry.value)
    }
    println()
}

fun buildFirewall(input: List<String>): Map<Int, Layer> {
    val layers = mutableMapOf<Int, Layer>()
    val pattern = Regex("(\\d+): (\\d+)")
    for (line in input) {
        val result = pattern.matchEntire(line)
        if (result != null) {
            val layerIndex = result.groups[1]!!.value.toInt()
            val depth = result.groups[2]!!.value.toInt()

            layers.put(layerIndex, Layer(depth, layerIndex))
        }
    }
    return layers
}

class Layer(private val depth: Int, private val index: Int) {
    private var scannerIndex = 0
    private var increment = 1

    fun moveScanner() {
        scannerIndex += increment
        if (scannerIndex == depth || scannerIndex < 0) {
            increment = -increment
            scannerIndex += 2 * increment
        }
    }

    fun getSeverityChange(): Int {
        return if (scannerIndex == 0 && index == 0) {
//            println("Oops! Caught at layer 0")
            1
        } else if (scannerIndex == 0) {
//            println("Oops! Caught at layer " + index)
            index * depth
        } else {
            0
        }
    }

    override fun toString(): String {
        return "[I: " + index + ", S:" + scannerIndex + "]"
    }

    fun copy(): Layer {
        val newLayer = Layer(depth, index)
        newLayer.scannerIndex = scannerIndex
        newLayer.increment = increment
        return newLayer
    }
}
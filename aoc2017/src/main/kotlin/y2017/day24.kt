package y2017

fun day24(input: List<String>): Int {
    return getBridges(input).map { bridge -> bridge.getStrength() }.max()!!
}

fun day24Second(input: List<String>): Int {
    val bridges = getBridges(input)
    val maxSize = bridges.map { bridge -> bridge.components.size }.max()!!
    val longestBridges = bridges.filter { bridge -> bridge.components.size == maxSize }
    return longestBridges.map { bridge -> bridge.getStrength() }.max()!!
}

fun getBridges(input: List<String>): List<Bridge> {
    val components = parseComponents(input)

    val bridges = mutableListOf<Bridge>()
    val basePiece = Component(0, 0)
    basePiece.attachTo(0)
    val starterPile = Pile(components).getMatchingPieces(basePiece)
    for (starterPiece in starterPile) {
        val pile = Pile(components)
        bridges.addAll(buildBridgesFrom(starterPiece, pile))
    }
    return bridges
}

fun buildBridgesFrom(piece: Component, pile: Pile, base: Bridge? = null): List<Bridge> {
    val pieceBridges = mutableListOf<Bridge>()
    pile.remove(piece)

    val currentBridge: Bridge
    val endPort: Int
    if (base == null) {
        currentBridge = Bridge(piece)
        endPort = 0
    } else {
        endPort = base.components.last().unused
        currentBridge = base.add(piece)
    }
    piece.attachTo(endPort)

    if (pile.getMatchingPieces(piece).size > 0) {
        for (nextPiece in pile.getMatchingPieces(piece)) {
            pieceBridges.addAll(buildBridgesFrom(nextPiece, Pile(pile.components), currentBridge))
        }
    } else {
        pieceBridges.add(currentBridge)
    }

    return pieceBridges
}

fun parseComponents(input: List<String>): List<Component> {
    val list = mutableListOf<Component>()

    for (line in input) {
        val ports = line.split("/")
        list.add(Component(ports[0].toInt(), ports[1].toInt()))
    }

    return list
}

class Component(vararg ports: Int) {
    val edges = ports.toList()
    var unused: Int = -1

    fun getStrength(): Int {
        return edges.reduce({acc, i -> i + acc })
    }

    fun attachTo(edge: Int) {
        if (edges[0] == edge) {
            unused = edges[1]
        } else {
            unused = edges[0]
        }
    }

    override fun toString(): String {
        return "${edges[0]}/${edges[1]}"
    }
}

class Bridge(vararg pieces: Component) {
    val components = mutableListOf(*pieces)

    fun getStrength(): Int {
        return components.map {component -> component.getStrength() }.reduce {acc, component -> acc + component }
    }

    fun add(piece: Component): Bridge {
        val bridge = Bridge(*components.toTypedArray())
        bridge.components.add(piece)
        return bridge
    }

    override fun toString(): String {
        val builder = StringBuilder()
        for (component in components) {
            builder.append(component)
            builder.append("--")
        }
        builder.setLength(builder.length - 2)
        return builder.toString()
    }
}

class Pile(components: List<Component>) {
    val components = ArrayList(components)

    fun getMatchingPieces(piece: Component): List<Component> {
        return components.filter { component -> component.edges.contains(piece.unused) }
    }

    fun size(): Int {
        return components.size
    }

    fun remove(piece: Component) {
        components.remove(piece)

    }
}
package y2018

fun day8(input: List<Int>): Int {
    val root = parseNodes(input.iterator())
    return root.getMetadataSum()
}

fun day8Second(input: List<Int>): Int {
    val root = parseNodes(input.iterator())
    return root.getValue()
}


fun parseNodes(input: Iterator<Int>): Node {
    var root: Node? = null
    while (input.hasNext()) {
        if (root != null) {
            throw Exception("OH NO")
        }
        root = parseNode( "1", input)
    }

    return root!!
}

fun parseNode(index: String, input: Iterator<Int>): Node {
    val childCount = input.next()
    val metadataCount = input.next()
    val node = Node(index)

    for (i in 0 until childCount step 1) {
        node.children.add(parseNode("$index-$i", input))
    }

    for (i in 0 until metadataCount step 1) {
        node.metadata.add(input.next())
    }
    return node
}

class Node(var id: String, var children: MutableList<Node> = mutableListOf(), var metadata: MutableList<Int> = mutableListOf()) {
    fun getMetadataSum(): Int {
        return metadata.sum() + children.map { node -> node.getMetadataSum() }.sum()
    }

    fun getValue(): Int {
        return if (children.isEmpty()) {
            metadata.sum()
        } else {
            metadata.map { i -> if (i > children.size) { 0 } else { children[i - 1].getValue() } }.sum()
        }
    }

    override fun toString(): String {
        return "Node(id='$id', children=$children, metadata=$metadata)"
    }
}

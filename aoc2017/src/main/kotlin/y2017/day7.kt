package y2017

fun day7(input: Array<String>): Node {
    val nodes = parseTower(input).values
    return findBottomNode(nodes)
}

fun findBottomNode(nodes: Collection<Node>): Node {
    return nodes.filter { node -> node.parent == null }.first()
}

fun findUnbalancedChild(input: Array<String>): Pair<Node, Int> {
    val nodes = parseTower(input).values
    val root = findBottomNode(nodes)

    return root.findUnbalancedChild()!!
}

fun parseTower(input: Array<String>): Map<String, Node> {
    val nodes = mutableMapOf<String, Node>()
    val regex = Regex("^(\\w+) \\((\\d+)\\).*$")
    for (line in input) {
        val result = regex.find(line)
        if (result != null) {
            val groups = result.groups
            val node = Node(groups[1]!!.value, groups[2]!!.value.toInt())
            nodes[node.name] = node
        }
    }

    val childRegex = Regex("^(\\w+)[\\w\\d ()]+ -> ([\\w, ]+)$")
    for (line in input) {
        val result = childRegex.find(line)
        if (result != null) {
            val parentName = result.groups[1]!!.value
            val parent = nodes[parentName]!!

            val children = result.groups[2]!!.value.split(", ")
            for (childName in children) {
                val child = nodes[childName]!!
                child.parent = parent
                parent.addChild(child)
            }
        }
    }

    return nodes
}


class Node(val name: String, val weight: Int) {
    var parent: Node? = null
    var children: MutableList<Node> = mutableListOf()

    override fun toString(): String {
        return "y2017.Node(name='$name', weight=$weight, parent=$parent)"
    }

    fun addChild(child: Node) {
        children.add(child)
    }

    fun findUnbalancedChild(): Pair<Node, Int>? {
        val unbalancedChildren = children.filter({child ->
            children.find({ other -> child != other && other.getTotalWeight() == child.getTotalWeight() }) == null
        })

        if (unbalancedChildren.isEmpty()) {
            return null
        } else {
            val unbalancedChild = unbalancedChildren.first()
            val childResult = unbalancedChild.findUnbalancedChild()
            if (childResult != null) {
                return childResult
            } else {
                val otherChild = children.find({child -> child != unbalancedChild})!!
                val delta = otherChild.getTotalWeight() - unbalancedChild.getTotalWeight()

                return Pair(unbalancedChild, unbalancedChild.weight + delta)
            }
        }
    }

    fun getTotalWeight(): Int {
        val totalWeight = weight
        val childWeights = children.map({child -> child.getTotalWeight()})

        val totalChildWeight = if (childWeights.isEmpty()) 0 else
                childWeights.reduce({totalChildWeight, childWeight -> totalChildWeight + childWeight})

        return totalWeight + totalChildWeight
    }
}
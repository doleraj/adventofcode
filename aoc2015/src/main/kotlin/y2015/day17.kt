package y2015

class Container(val id: Int, val capacity: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Container

        if (id != other.id) return false
        if (capacity != other.capacity) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + capacity
        return result
    }

    override fun toString(): String {
        return "Container(id=$id, capacity=$capacity)"
    }
}

fun manageContainer(container: Container, litersLeft: Int, currentConfig: MutableSet<Container>, remainingContainers: List<Container>, memoized: MutableMap<Int, MutableMap<List<Container>, Set<Set<Container>>>>): Set<Set<Container>> {
//    println("Checking container $container, current config $currentConfig")
    currentConfig.add(container);
    val newLitersLeft = litersLeft - container.capacity;

    if (newLitersLeft == 0) {
//        println("Container uses all, returning current config")
        return setOf(currentConfig);
    } else if (newLitersLeft < 0) {
//        println("Less than 0, returning empty")
        return emptySet();
    } else {
        if (memoized.containsKey(newLitersLeft) && memoized[newLitersLeft]!!.containsKey(remainingContainers)) {
            return memoized[newLitersLeft]!![remainingContainers]!!;
        } else {
            if (!memoized.containsKey(newLitersLeft)) {
                memoized[newLitersLeft] = mutableMapOf();
            }

            if (!memoized[newLitersLeft]!!.containsKey(remainingContainers)) {
                memoized[newLitersLeft]!![remainingContainers] = emptySet();
            }
        }

        val subList = mutableSetOf<Set<Container>>();
        for (newContainer in remainingContainers) {
            if (newContainer.capacity <= newLitersLeft) {
                subList.addAll(
                    manageContainer(
                        newContainer,
                        newLitersLeft,
                        currentConfig.toMutableSet(),
                        remainingContainers - newContainer,
                        memoized
                    )
                );
            }
        }
        memoized[newLitersLeft]!![remainingContainers] = subList;

        return subList;
    }
}

fun day17(liters: Int, input: List<String>): Int {
    var containerId = 0;
    val containers = input.map { Container(containerId++, it.toInt()) };
    val validConfigs = mutableSetOf<Set<Container>>();
    val memoized = hashMapOf<Int, MutableMap<List<Container>, Set<Set<Container>>>>();

    for (container in containers) {
        validConfigs.addAll(manageContainer(container, liters, mutableSetOf(), containers - container, memoized));
    }

    return validConfigs.size;
}

fun day17Second(liters: Int, input: List<String>): Int {
    var containerId = 0;
    val containers = input.map { Container(containerId++, it.toInt()) };
    val validConfigs = mutableSetOf<Set<Container>>();
    val memoized = hashMapOf<Int, MutableMap<List<Container>, Set<Set<Container>>>>();

    for (container in containers) {
        validConfigs.addAll(manageContainer(container, liters, mutableSetOf(), containers - container, memoized));
    }
    val minContainers = validConfigs.map { set -> set.size }.min();
    val maxContainers = validConfigs.map { set -> set.size }.max();
    println(minContainers);
    println(maxContainers)
    val validConfigurationsWithMinContainers = validConfigs.filter { set -> set.size == minContainers };

    return validConfigurationsWithMinContainers.size;
}

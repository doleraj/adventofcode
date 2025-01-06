package y2015


class Grouping(val a: List<Int> = mutableListOf(), val b: List<Int> = mutableListOf(), val c: List<Int> = mutableListOf()) {
    override fun toString(): String {
        return "Grouping(a=$a, b=$b, c=$c)"
    }

    fun getSmallestGroup(): List<Int> {
        return if (a.sum() < b.sum() && a.sum() < c.sum()) {
            a
        } else if (b.sum() < c.sum()) {
            b;
        } else {
            c
        }
    }
}

fun combinations(list: List<Int>, desiredLength: Int, previousList: MutableList<Int>): List<MutableList<Int>> {
//    println(previousList)
    if (previousList.size == desiredLength) {
        return listOf(previousList);
    }

    val combos = mutableListOf<MutableList<Int>>();
    list.forEachIndexed { index, item ->
//        println("Looking at item $item at index $index")
        val nextArray = previousList.toMutableList()
//        println(nextArray)
        nextArray.add(item);
        combos.addAll(combinations(list.slice(index + 1..list.lastIndex), desiredLength, nextArray))
    }

    return combos;
}

fun calculateBullshitEntropy(packages: List<Int>): Long {
    return packages.map { it.toLong() }.reduce { acc, i -> acc * i }
}

fun day24(input: String): Long {
    val packages = input.split("\n").map { it.toInt() }.sorted().reversed();
    var possibleFirstGroups = listOf<List<Int>>()
    val idealWeight = packages.sum() / 3

    for (i in packages.indices) {
        println(i)
        possibleFirstGroups = combinations(packages.toMutableList(), i, mutableListOf())
        possibleFirstGroups = possibleFirstGroups.filter({ it.sum() == idealWeight })
        if (possibleFirstGroups.isNotEmpty()) {
            break;
        }
    }

    println("Grouping done")
    val firstGroupsEntropy = possibleFirstGroups.map { calculateBullshitEntropy(it) }.sorted();
    println(firstGroupsEntropy)

    return firstGroupsEntropy[0];
}

fun day24Second(input: String): Long {
    val packages = input.split("\n").map { it.toInt() }.sorted().reversed();
    var possibleFirstGroups = listOf<List<Int>>()
    val idealWeight = packages.sum() / 4

    for (i in packages.indices) {
        println(i)
        possibleFirstGroups = combinations(packages.toMutableList(), i, mutableListOf())
        possibleFirstGroups = possibleFirstGroups.filter({ it.sum() == idealWeight })
        if (possibleFirstGroups.isNotEmpty()) {
            break;
        }
    }

    println("Grouping done")
    val firstGroupsEntropy = possibleFirstGroups.map { calculateBullshitEntropy(it) }.sorted();
    println(firstGroupsEntropy)

    return firstGroupsEntropy[0];
}

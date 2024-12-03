package y2015

val day9regex = "([a-zA-Z]+) to ([a-zA-Z]+) = (\\d+)".toRegex();

fun parse(input: List<String>): MutableMap<String, MutableMap<String, Int>> {
    val distanceMap = mutableMapOf<String, MutableMap<String, Int>>();
    input.forEach({
        val match = day9regex.matchEntire(it);
        val origin = match!!.groupValues[1];
        val dest = match.groupValues[2];
        val distance = Integer.parseInt(match.groupValues[3]);

        if (!distanceMap.containsKey(origin)) {
            distanceMap.put(origin, mutableMapOf());
        }
        if (!distanceMap.containsKey(dest)) {
            distanceMap.put(dest, mutableMapOf());
        }

        distanceMap[origin]?.set(dest, distance);
        distanceMap[dest]?.set(origin, distance);
    });
//    println(distanceMap);
    return distanceMap;
}

fun day9(input: List<String>): Int {
    val distanceMap = parse(input);

    val locationsToVisit = distanceMap.keys;
    val distances = mutableListOf<Int>()
    locationsToVisit.forEach({
//        println("========================");
        val locationsVisited = mutableListOf<String>();

        distances.addAll(visitLocation(it, locationsVisited, distanceMap));
    });
//    println(distances);
    distances.sort();
    return distances[0];
}

fun visitLocation(location: String, locationsVisited: MutableList<String>, distanceMap: MutableMap<String, MutableMap<String, Int>>) : List<Int> {
//    println("Visiting $location, have visited $locationsVisited");
    locationsVisited.add(location);

    val destMap = distanceMap[location]?.filter { !locationsVisited.contains(it.key) }!!;
//    println("Possible destinations from $location: $destMap");

    if (destMap.isEmpty()) {
//        println("Hit the end, returning 0");
        return mutableListOf(0);
    }

    return destMap.map { entry ->
        val bar = visitLocation(entry.key, locationsVisited.toMutableList(), distanceMap).map { entry.value + it };
//        println("Leaving $location, list of distances: $bar");
        return@map bar;
    }.flatten();
}

fun day9Second(input: List<String>): Int {
    val distanceMap = parse(input);

    val locationsToVisit = distanceMap.keys;
    val distances = mutableListOf<Int>()
    locationsToVisit.forEach({
//        println("========================");
        val locationsVisited = mutableListOf<String>();

        distances.addAll(visitLocation(it, locationsVisited, distanceMap));
    });
//    println(distances);
    distances.sort();
    return distances[distances.lastIndex];
}
package y2015

fun day20(): Int {

    var total = 0;
    var house = 1;
    while (total < 34000000) {
        total = 0;

        if (house % 10000 == 0) {
            println(house);
        }

        for (elf in 1.. house) {
            if (house % elf == 0) {
                total += elf * 10;
            }
        }
        house++;
    }
    return house - 1;
}


fun day20Second(): Int {
    var total = 0;
    var house = 1;
    val elfCounts = mutableMapOf<Int, Int>();
    while (total < 34000000) {
        total = 0;

        if (house % 10000 == 0) {
            println(house);
        }

        for (elf in 1.. house) {
            if (house % elf == 0) {
                if (!elfCounts.containsKey(elf)) {
                    elfCounts[elf] = 0;
                }

                if (elfCounts[elf] != 50) {
                    total += elf * 11;
                    elfCounts[elf] = elfCounts[elf]!! + 1;
                }
            }
        }
        house++;
    }
    return house - 1;
}

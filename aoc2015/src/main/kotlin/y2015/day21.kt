package y2015

class Equipment(val name: String, val cost: Int, val damage: Int, val armor: Int) {
    override fun toString(): String {
        return "Equipment(name='$name', cost=$cost, damage=$damage, armor=$armor)"
    }
}

fun runCombat(hpInit: Int, damage: Int, armor: Int, bossHPInit: Int, bossDamage: Int, bossArmor: Int): Boolean {
    println("======= $hpInit $damage $armor $bossHPInit $bossDamage $bossArmor")
    var hp = hpInit;
    var bossHP = bossHPInit;

    while (hp > 0 && bossHP > 0) {
        // your turn
        bossHP -= Math.max(1, damage - bossArmor);
//        println("The player deals $damage-$bossArmor = ${damage - bossArmor} damage; the boss goes down to ${bossHP} hit points.")

        // boss turn if not dead
        if (bossHP > 0) {
            hp -= Math.max(1, bossDamage - armor);
//            println("The boss deals $bossDamage-$armor = ${bossDamage - armor} damage; the boss goes down to ${hp} hit points.")
        }
    }

    return bossHP <= 0;
}

fun day21(input: String): Int {
    val inputRegex = "Hit Points: (\\d+)\nDamage: (\\d+)\nArmor: (\\d+)".toRegex();
    val matches = inputRegex.matchEntire(input);
    val bossHP = matches!!.groupValues[1].toInt()
    val bossDamage = matches.groupValues[2].toInt();
    val bossArmor = matches.groupValues[3].toInt();

    val weapons = listOf(
        Equipment("Dagger", 8, 4 ,0),
        Equipment("Shortsword", 10, 5 ,0),
        Equipment("Warhammer", 25, 6 ,0),
        Equipment("Longsword", 40, 7 ,0),
        Equipment("Greataxe", 74, 8 ,0),
    )

    val armors = listOf(
        Equipment("Nothing", 0, 0, 0),
        Equipment("Leather", 13, 0 ,1),
        Equipment("Chainmail", 31, 0 ,2),
        Equipment("Warhammer", 53, 0 ,3),
        Equipment("Longsword", 75, 0 ,4),
        Equipment("Greataxe", 102, 0 ,5),
    )

    val rings = listOf(
        Equipment("Nothing 1", 0, 0, 0),
        Equipment("Nothing 2", 0, 0, 0),
        Equipment("Damage +1", 25, 1 ,0),
        Equipment("Damage +2", 50, 2 ,0),
        Equipment("Damage +3", 100, 3 ,0),
        Equipment("Defense + 1", 20, 0 ,1),
        Equipment("Defense + 2", 40, 0 ,2),
        Equipment("Defense + 3", 80, 0 ,3),
    )

    val successfulCosts = mutableListOf<Int>()
    for (weapon in weapons) {
        for (armor in armors) {
            for (ring1 in rings) {
                for (ring2 in rings) {
                    if (ring1.name == ring2.name) {
                        continue;
                    }

                    val damageVal = weapon.damage + ring1.damage + ring2.damage;
                    val armorVal = armor.armor + ring1.armor + ring2.armor;

                    if (runCombat(100, damageVal, armorVal, bossHP, bossDamage, bossArmor)) {
                        successfulCosts.add(weapon.cost + armor.cost + ring1.cost + ring2.cost)
                    }
                }
            }
        }
    }

    return successfulCosts.sorted()[0];
}

fun day21Second(input: String): Int {
    val inputRegex = "Hit Points: (\\d+)\nDamage: (\\d+)\nArmor: (\\d+)".toRegex();
    val matches = inputRegex.matchEntire(input);
    val bossHP = matches!!.groupValues[1].toInt()
    val bossDamage = matches.groupValues[2].toInt();
    val bossArmor = matches.groupValues[3].toInt();

    val weapons = listOf(
        Equipment("Dagger", 8, 4 ,0),
        Equipment("Shortsword", 10, 5 ,0),
        Equipment("Warhammer", 25, 6 ,0),
        Equipment("Longsword", 40, 7 ,0),
        Equipment("Greataxe", 74, 8 ,0),
    )

    val armors = listOf(
        Equipment("Nothing", 0, 0, 0),
        Equipment("Leather", 13, 0 ,1),
        Equipment("Chainmail", 31, 0 ,2),
        Equipment("Warhammer", 53, 0 ,3),
        Equipment("Longsword", 75, 0 ,4),
        Equipment("Greataxe", 102, 0 ,5),
    )

    val rings = listOf(
        Equipment("Nothing 1", 0, 0, 0),
        Equipment("Nothing 2", 0, 0, 0),
        Equipment("Damage +1", 25, 1 ,0),
        Equipment("Damage +2", 50, 2 ,0),
        Equipment("Damage +3", 100, 3 ,0),
        Equipment("Defense + 1", 20, 0 ,1),
        Equipment("Defense + 2", 40, 0 ,2),
        Equipment("Defense + 3", 80, 0 ,3),
    )

    val unsuccessfulCosts = mutableListOf<Int>()
    for (weapon in weapons) {
        for (armor in armors) {
            for (ring1 in rings) {
                for (ring2 in rings) {
                    if (ring1.name == ring2.name) {
                        continue;
                    }

                    val damageVal = weapon.damage + ring1.damage + ring2.damage;
                    val armorVal = armor.armor + ring1.armor + ring2.armor;

                    if (!runCombat(100, damageVal, armorVal, bossHP, bossDamage, bossArmor)) {
                        unsuccessfulCosts.add(weapon.cost + armor.cost + ring1.cost + ring2.cost)
                    }
                }
            }
        }
    }

    return unsuccessfulCosts.sorted()[unsuccessfulCosts.size - 1];
}

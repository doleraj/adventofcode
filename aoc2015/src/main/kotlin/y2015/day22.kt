package y2015

import java.util.PriorityQueue

class Spell(val name: String, val cost: Int, val turns: Int, val instantEffect: (Game) -> Unit = {}, val ongoingEffect: (Game) -> Unit = {}, val endEffect: (Game) -> Unit = {}) {
    override fun toString(): String {
        return "Equipment(name='$name', cost=$cost"
    }
}

class Game(
    var turnNumber: Int,
    var hp: Int,
    var armor: Int,
    var mana: Int,
    var manaUsed: Int,
    var bossHP: Int,
    var bossDamage: Int,
    var spellsActive: MutableMap<String, Int>
): Comparable<Game> {
    override fun compareTo(other: Game) = when {
        this.turnNumber != other.turnNumber -> this.turnNumber compareTo other.turnNumber
        else -> 0
    }
}

fun runSpellEffects(game: Game, spells: Map<String, Spell>) {
    val nextSpellEffects = mutableMapOf<String, Int>();
    for (spellEntry in game.spellsActive) {
        val spell = spells[spellEntry.key]!!;

        spell.ongoingEffect(game);

        if (spellEntry.value == 1) {
            spell.endEffect(game);
        } else {
            nextSpellEffects[spellEntry.key] = game.spellsActive[spellEntry.key]!! - 1;
        }
    }

    game.spellsActive = nextSpellEffects;
}

fun day22(input: String): Int {
    val inputRegex = "Hit Points: (\\d+)\nDamage: (\\d+)".toRegex();
    val matches = inputRegex.matchEntire(input);
    val bossHP = matches!!.groupValues[1].toInt()
    val bossDamage = matches.groupValues[2].toInt();
    val initHP = 50;
    val initMana = 500;
    var minSuccessfulCost = Int.MAX_VALUE;

    val spells = mapOf(
        Pair("Magic Missile", Spell("Magic Missile", 53, 0, instantEffect = { game -> game.bossHP -= 4 })),
        Pair("Drain", Spell("Drain", 73, 0, instantEffect = { game ->
          game.bossHP -= 2;
          game.hp += 2;
        })),
        Pair("Shield", Spell("Shield", 113, 6, instantEffect = { game -> game.armor += 7 }, endEffect = { game -> game.armor -= 7 })),
        Pair("Poison", Spell("Poison", 173, 6, ongoingEffect = { game -> game.bossHP -= 3 })),
        Pair("Recharge", Spell("Recharge", 229, 5, ongoingEffect = { game -> game.mana += 101 })),
    );

    val gamesInProgress = PriorityQueue<Game>();
    gamesInProgress.add(Game(0, initHP, 0, initMana, 0, bossHP, bossDamage, mutableMapOf()))
    while (gamesInProgress.isNotEmpty()) {
        val game = gamesInProgress.remove();
//        println("Starting a game on turn " + game.turnNumber + ", player HP is " + game.hp);

        if (game.manaUsed > minSuccessfulCost) {
            continue;
        }

        // Player goes first so skip boss turn the first round
        if (game.turnNumber != 0) {
            // Boss turn
            // Spell effects
            runSpellEffects(game, spells);
            if (game.bossHP <= 0) {
                minSuccessfulCost = minSuccessfulCost.coerceAtMost(game.manaUsed);
                continue;
            }
            game.hp -= 0.coerceAtLeast(game.bossDamage - game.armor);

            if (game.hp <= 0) {
//                println("Player dead, boss was at: " + game.bossHP);
                continue;
            }
        }

        // Player turn
        runSpellEffects(game, spells);
        if (game.bossHP <= 0) {
            minSuccessfulCost = minSuccessfulCost.coerceAtMost(game.manaUsed);
            continue;
        }

        var spellsCast = 0;
        for (spell in spells) {
            if (game.spellsActive.containsKey(spell.key)) {
                continue;
            }
            if (game.mana < spell.value.cost) {
                continue;
            }

            spellsCast++;
            val nextGame = Game(game.turnNumber + 1, game.hp, game.armor, game.mana, game.manaUsed, game.bossHP, game.bossDamage, game.spellsActive.toMutableMap());
            nextGame.mana -= spell.value.cost;
            nextGame.manaUsed += spell.value.cost;
            spell.value.instantEffect(nextGame);

            if (spell.value.turns > 0) {
                nextGame.spellsActive[spell.key] = spell.value.turns;
            }

            gamesInProgress.add(nextGame);
        }
    }

    return minSuccessfulCost;
}

fun day22Second(input: String): Int {
    val inputRegex = "Hit Points: (\\d+)\nDamage: (\\d+)".toRegex();
    val matches = inputRegex.matchEntire(input);
    val bossHP = matches!!.groupValues[1].toInt()
    val bossDamage = matches.groupValues[2].toInt();
    val initHP = 50;
    val initMana = 500;
    var minSuccessfulCost = Int.MAX_VALUE;

    val spells = mapOf(
        Pair("Magic Missile", Spell("Magic Missile", 53, 0, instantEffect = { game -> game.bossHP -= 4 })),
        Pair("Drain", Spell("Drain", 73, 0, instantEffect = { game ->
            game.bossHP -= 2;
            game.hp += 2;
        })),
        Pair("Shield", Spell("Shield", 113, 6, instantEffect = { game -> game.armor += 7 }, endEffect = { game -> game.armor -= 7 })),
        Pair("Poison", Spell("Poison", 173, 6, ongoingEffect = { game -> game.bossHP -= 3 })),
        Pair("Recharge", Spell("Recharge", 229, 5, ongoingEffect = { game -> game.mana += 101 })),
    );

    val gamesInProgress = PriorityQueue<Game>();
    gamesInProgress.add(Game(0, initHP, 0, initMana, 0, bossHP, bossDamage, mutableMapOf()))
    while (gamesInProgress.isNotEmpty()) {
        val game = gamesInProgress.remove();
//        println("Starting a game on turn " + game.turnNumber + ", player HP is " + game.hp);

        if (game.manaUsed > minSuccessfulCost) {
            continue;
        }

        // Player goes first so skip boss turn the first round
        if (game.turnNumber != 0) {
            // Boss turn
            // Spell effects
            runSpellEffects(game, spells);
            if (game.bossHP <= 0) {
                minSuccessfulCost = minSuccessfulCost.coerceAtMost(game.manaUsed);
                continue;
            }
            game.hp -= 0.coerceAtLeast(game.bossDamage - game.armor);

            if (game.hp <= 0) {
//                println("Player dead, boss was at: " + game.bossHP);
                continue;
            }
        }

        // Player turn
        game.hp -= 1;
        if (game.hp <= 0) {
//                println("Player dead, boss was at: " + game.bossHP);
            continue;
        }

        runSpellEffects(game, spells);
        if (game.bossHP <= 0) {
            minSuccessfulCost = minSuccessfulCost.coerceAtMost(game.manaUsed);
            continue;
        }

        var spellsCast = 0;
        for (spell in spells) {
            if (game.spellsActive.containsKey(spell.key)) {
                continue;
            }
            if (game.mana < spell.value.cost) {
                continue;
            }

            spellsCast++;
            val nextGame = Game(game.turnNumber + 1, game.hp, game.armor, game.mana, game.manaUsed, game.bossHP, game.bossDamage, game.spellsActive.toMutableMap());
            nextGame.mana -= spell.value.cost;
            nextGame.manaUsed += spell.value.cost;
            spell.value.instantEffect(nextGame);

            if (spell.value.turns > 0) {
                nextGame.spellsActive[spell.key] = spell.value.turns;
            }

            gamesInProgress.add(nextGame);
        }
    }

    return minSuccessfulCost;
}

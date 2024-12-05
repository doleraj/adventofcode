package y2015

val day15ParseRegex = "([a-zA-Z]+): capacity (-?\\d+), durability (-?\\d+), flavor (-?\\d+), texture (-?\\d+), calories (-?\\d+)".toRegex();

class Ingredient(val name: String, val capacity: Int, val durability: Int, val flavor: Int, val texture: Int, val calories: Int) {

    fun scores(tablespoons: Int): List<Int> {
        return listOf(tablespoons * capacity, tablespoons * durability, tablespoons * flavor, tablespoons * texture, tablespoons * calories);
    }

    override fun toString(): String {
        return "Ingredient(name='$name', capacity=$capacity, durability=$durability, flavor=$flavor, texture=$texture, calories=$calories"
    }
}

fun day15Parse(input: List<String>): List<Ingredient> {
    return input.map { line ->
        val match = day15ParseRegex.find(line)!!;

        Ingredient(match.groupValues[1], match.groupValues[2].toInt(), match.groupValues[3].toInt(), match.groupValues[4].toInt(), match.groupValues[5].toInt(), match.groupValues[6].toInt());
    }
}

fun day15(input: List<String>): Int {
    val ingredients = day15Parse(input);

    val currentIngredients = ingredients.indices.toMutableList();

    var maxScore = 0;
    if (currentIngredients.size == 2) {
        val ing1 = ingredients[0];
        val ing2 = ingredients[1];

        for (ing1Tbsp in 100 downTo 0) {
            val ing2Tbsp = 100 - ing1Tbsp;

            val ing1Scores = ing1.scores(ing1Tbsp);
            val ing2Scores = ing2.scores(ing2Tbsp);
            val cScore = ing1Scores[0] + ing2Scores[0];
            val dScore = ing1Scores[1] + ing2Scores[1];
            val fScore = ing1Scores[2] + ing2Scores[2];
            val tScore = ing1Scores[3] + ing2Scores[3];

            val newScore =  (if (cScore > 0) cScore else 0) * (if (dScore > 0) dScore else 0) * (if (fScore > 0) fScore else 0) * (if (tScore > 0) tScore else 0);
            if (newScore > maxScore) {
//                println("New high score $maxScore from $ing1Scores and $ing2Scores resulting in [$cScore, $dScore, $fScore, $tScore] with $ing1Tbsp and $ing2Tbsp");
                maxScore = newScore;
            }
        }

    } else if (currentIngredients.size == 4) {
        val ing1 = ingredients[0];
        val ing2 = ingredients[1];
        val ing3 = ingredients[2];
        val ing4 = ingredients[3];

        for (ing1Tbsp in 100 downTo 0) {
            for (ing2Tbsp in 100 - ing1Tbsp downTo 0) {
                for (ing3Tbsp in 100 - (ing1Tbsp + ing2Tbsp) downTo 0) {
                    val ing4Tbsp = 100 - (ing1Tbsp + ing2Tbsp + ing3Tbsp);

                    val ing1Scores = ing1.scores(ing1Tbsp);
                    val ing2Scores = ing2.scores(ing2Tbsp);
                    val ing3Scores = ing3.scores(ing3Tbsp);
                    val ing4Scores = ing4.scores(ing4Tbsp);
                    val cScore = ing1Scores[0] + ing2Scores[0] + ing3Scores[0] + ing4Scores[0];
                    val dScore = ing1Scores[1] + ing2Scores[1] + ing3Scores[1] + ing4Scores[1];
                    val fScore = ing1Scores[2] + ing2Scores[2] + ing3Scores[2] + ing4Scores[2];
                    val tScore = ing1Scores[3] + ing2Scores[3] + ing3Scores[3] + ing4Scores[3];

                    val newScore =  (if (cScore > 0) cScore else 0) * (if (dScore > 0) dScore else 0) * (if (fScore > 0) fScore else 0) * (if (tScore > 0) tScore else 0);
                    if (newScore > maxScore) {
//                println("New high score $maxScore from $ing1Scores and $ing2Scores resulting in [$cScore, $dScore, $fScore, $tScore] with $ing1Tbsp and $ing2Tbsp");
                        maxScore = newScore;
                    }
                }
            }
        }
    }

    return maxScore;
}

fun day15Second(input: List<String>): Int {
    val ingredients = day15Parse(input);

    val currentIngredients = ingredients.indices.toMutableList();

    var maxScore = 0;
    if (currentIngredients.size == 2) {
        val ing1 = ingredients[0];
        val ing2 = ingredients[1];

        for (ing1Tbsp in 100 downTo 0) {
            val ing2Tbsp = 100 - ing1Tbsp;

            val ing1Scores = ing1.scores(ing1Tbsp);
            val ing2Scores = ing2.scores(ing2Tbsp);
            val cScore = ing1Scores[0] + ing2Scores[0];
            val dScore = ing1Scores[1] + ing2Scores[1];
            val fScore = ing1Scores[2] + ing2Scores[2];
            val tScore = ing1Scores[3] + ing2Scores[3];
            val calScore = ing1Scores[4] + ing2Scores[4];

            val newScore = if (calScore != 500) {
                0
            } else {
                (if (cScore > 0) cScore else 0) * (if (dScore > 0) dScore else 0) * (if (fScore > 0) fScore else 0) * (if (tScore > 0) tScore else 0);
            }

            if (newScore > maxScore) {
//                println("New high score $newScore from $ing1Scores and $ing2Scores resulting in [$cScore, $dScore, $fScore, $tScore] with $ing1Tbsp and $ing2Tbsp");
                maxScore = newScore;
            }
        }

    } else if (currentIngredients.size == 4) {
        val ing1 = ingredients[0];
        val ing2 = ingredients[1];
        val ing3 = ingredients[2];
        val ing4 = ingredients[3];

        for (ing1Tbsp in 100 downTo 0) {
            for (ing2Tbsp in 100 - ing1Tbsp downTo 0) {
                for (ing3Tbsp in 100 - (ing1Tbsp + ing2Tbsp) downTo 0) {
                    val ing4Tbsp = 100 - (ing1Tbsp + ing2Tbsp + ing3Tbsp);

                    val ing1Scores = ing1.scores(ing1Tbsp);
                    val ing2Scores = ing2.scores(ing2Tbsp);
                    val ing3Scores = ing3.scores(ing3Tbsp);
                    val ing4Scores = ing4.scores(ing4Tbsp);
                    val cScore = ing1Scores[0] + ing2Scores[0] + ing3Scores[0] + ing4Scores[0];
                    val dScore = ing1Scores[1] + ing2Scores[1] + ing3Scores[1] + ing4Scores[1];
                    val fScore = ing1Scores[2] + ing2Scores[2] + ing3Scores[2] + ing4Scores[2];
                    val tScore = ing1Scores[3] + ing2Scores[3] + ing3Scores[3] + ing4Scores[3];
                    val calScore = ing1Scores[4] + ing2Scores[4] + ing3Scores[4] + ing4Scores[4];

                    val newScore = if (calScore != 500) {
                        0
                    } else {
                        (if (cScore > 0) cScore else 0) * (if (dScore > 0) dScore else 0) * (if (fScore > 0) fScore else 0) * (if (tScore > 0) tScore else 0);
                    }

                    if (newScore > maxScore) {
                println("New high score $maxScore from $ing1Scores and $ing2Scores and $ing3Scores and $ing4Scores resulting in [$cScore, $dScore, $fScore, $tScore, $calScore] with $ing1Tbsp, $ing2Tbsp, $ing3Tbsp, $ing4Tbsp");
                        maxScore = newScore;
                    }
                }
            }
        }
    }

    return maxScore;
}

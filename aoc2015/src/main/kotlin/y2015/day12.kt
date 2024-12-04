package y2015

import kotlinx.serialization.json.*

fun day12HandleJsonArray(array: JsonArray): Int {
    var numberSum = 0;
    for (element in array) {
        numberSum += when (element) {
            is JsonPrimitive -> day12HandleJsonPrimitive(element.jsonPrimitive);
            is JsonObject -> day12HandleJsonObject(element.jsonObject);
            is JsonArray -> day12HandleJsonArray(element.jsonArray);
        }
    }
    return numberSum;
}

fun day12HandleJsonObject(obj: JsonObject): Int {
    var numberSum = 0;
    obj.forEach { key, element ->
        numberSum += when (element) {
            is JsonPrimitive -> day12HandleJsonPrimitive(element.jsonPrimitive);
            is JsonObject -> day12HandleJsonObject(element.jsonObject);
            is JsonArray -> day12HandleJsonArray(element.jsonArray);
        }
    }
    return numberSum;
}

fun day12HandleJsonPrimitive(primitive: JsonPrimitive): Int {
    return if (!primitive.isString) {
        primitive.toString().toInt();
    } else {
        0;
    }
}

fun day12(input: String): Int {
    val element = Json.parseToJsonElement(input);
    return when (element) {
        is JsonPrimitive -> day12HandleJsonPrimitive(element.jsonPrimitive);
        is JsonObject -> day12HandleJsonObject(element.jsonObject);
        is JsonArray -> day12HandleJsonArray(element.jsonArray);
    }
}

fun day12HandleJsonArraySecond(array: JsonArray): Int {
    var numberSum = 0;
    for (element in array) {
        val result = when (element) {
            is JsonArray -> day12HandleJsonArraySecond(element.jsonArray);
            is JsonObject -> day12HandleJsonObjectSecond(element.jsonObject);
            is JsonPrimitive -> {
                val primitive = element.jsonPrimitive;
                if (!primitive.isString) {
                    primitive.toString().toInt();
                } else {
                    0;
                }
            }
        }

        numberSum += result;
    }
    return numberSum;
}

fun day12HandleJsonObjectSecond(obj: JsonObject): Int {
    var numberSum = 0;
    for (entry in obj) {
        val result = when (val element = entry.value) {
            is JsonArray -> day12HandleJsonArraySecond(element.jsonArray);
            is JsonObject -> day12HandleJsonObjectSecond(element.jsonObject);
            is JsonPrimitive -> {
                val primitive = element.jsonPrimitive;
                if (!primitive.isString) {
                    primitive.toString().toInt();
                } else {
                    if (primitive.content == "red") {
                        return 0;
                    } else {
                        0;
                    }
                }
            }
        }

//        println("Adding $result from ${entry.value}")
        numberSum += result;
    }
    return numberSum;
}

fun day12Second(input: String): Int {
    val element = Json.parseToJsonElement(input);
    return when (element) {
        is JsonPrimitive -> day12HandleJsonPrimitive(element.jsonPrimitive);
        is JsonObject -> day12HandleJsonObjectSecond(element.jsonObject);
        is JsonArray -> day12HandleJsonArraySecond(element.jsonArray);
    }
}

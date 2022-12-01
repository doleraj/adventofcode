package y2017

import java.util.*

fun day4(passphrases: Array<String>): Int {
    return passphrases.map({passphrase ->
        if (isValid(passphrase)) 1 else 0
    }).reduce({ validCount, result -> result + validCount})
}

fun isValid(passphrase: String): Boolean {
    val words = passphrase.split(" ")
    return words.map({ word -> words.count({foo -> foo == word}) }).filter({ count -> count > 1 }).isEmpty()
}

fun day4Second(passphrases: Array<String>): Int {
    return passphrases.map({passphrase ->
        if (isValid2(passphrase)) 1 else 0
    }).reduce({ validCount, result -> result + validCount})
}

fun isValid2(passphrase: String): Boolean {
    val words = passphrase.split(" ")
    return words.map({ word -> words.count({foo -> areEqualOrAnagrams(foo, word) }) }).filter({ count -> count > 1 }).isEmpty()
}

fun areEqualOrAnagrams(word1: String, word2: String): Boolean {
    if (word1 == word2) {
        return true
    }
    val word1Array = word1.toCharArray()
    val word2Array = word2.toCharArray()
    word1Array.sort()
    word2Array.sort()

    return Arrays.equals(word1Array, word2Array)
}
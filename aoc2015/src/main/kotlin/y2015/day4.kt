package y2015

import java.security.MessageDigest
import javax.xml.bind.DatatypeConverter

fun day4(input: String): Int {
    val digester = MessageDigest.getInstance("MD5")
    var number = 0
    do {
        val hashResult = DatatypeConverter.printHexBinary(digester.digest((input + ++number).toByteArray()))
    } while (!hashResult.startsWith("00000"))
    return number
}

fun day4Second(input: String): Int {
    val digester = MessageDigest.getInstance("MD5")
    var number = 0
    do {
        val hashResult = DatatypeConverter.printHexBinary(digester.digest((input + ++number).toByteArray()))
    } while (!hashResult.startsWith("000000"))
    return number
}

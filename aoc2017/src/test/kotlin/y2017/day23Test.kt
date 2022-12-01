package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day23Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        return File(fileUri).readLines()
    }

    @Test
    fun testActual() {
        assertEquals(9409, day23(parseFile("2017/day23ActualInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(913, day23Second(parseFile("2017/day23Primes.txt")))
    }
}

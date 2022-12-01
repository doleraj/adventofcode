package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day20Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        return File(fileUri).readLines()
    }

    @Test
    fun test1() {
        assertEquals(0, day20(parseFile("2017/day20TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(457, day20(parseFile("2017/day20ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(1, day20Second(parseFile("2017/day20TestInput2.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(448, day20Second(parseFile("2017/day20ActualInput.txt")))
    }
}
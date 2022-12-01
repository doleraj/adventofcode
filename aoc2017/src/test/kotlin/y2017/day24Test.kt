package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day24Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        return File(fileUri).readLines()
    }

    @Test
    fun test1() {
        assertEquals(31, day24(parseFile("2017/day24TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(1859, day24(parseFile("2017/day24ActualInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(1859, day24Second(parseFile("2017/day24ActualInput.txt")))
    }
}
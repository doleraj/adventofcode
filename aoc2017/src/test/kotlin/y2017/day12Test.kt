package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day12Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0, { "" })
        File(fileUri).forEachLine { line -> lines.add(line) }
        return lines
    }

    @Test
    fun test1() {
        assertEquals(6, day12(parseFile("2017/day12TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(134, day12(parseFile("2017/day12ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(2, day12Second(parseFile("2017/day12TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(193, day12Second(parseFile("2017/day12ActualInput.txt")))
    }
}
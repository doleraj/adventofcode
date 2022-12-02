package y2017

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.File

class day13Test {

    fun parseFile(name: String): List<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0, { "" })
        File(fileUri).forEachLine { line -> lines.add(line) }
        return lines
    }

    @Test
    fun test1() {
        assertEquals(24, day13(parseFile("2017/day13TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(1876, day13(parseFile("2017/day13ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(10, day13Second(parseFile("2017/day13TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(3964778, day13Second(parseFile("2017/day13ActualInput.txt")))
    }
}

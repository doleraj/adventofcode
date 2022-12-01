package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day10Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(3, day10(parseFile("y2018/day10TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(3, day10(parseFile("y2018/day10ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(3, day10Second(parseFile("y2018/day10TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(3, day10Second(parseFile("y2018/day10ActualInput.txt")))
    }
}
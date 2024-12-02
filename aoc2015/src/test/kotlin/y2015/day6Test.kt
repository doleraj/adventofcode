package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.day6
import y2015.day6Second
import java.io.File

class day6Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(1_000_000, day6(listOf("turn on 0,0 through 999,999")))
    }

    @Test
    fun test2() {
        assertEquals(999_996, day6(listOf("turn on 0,0 through 999,999","turn off 499,499 through 500,500")))
    }

    @Test
    fun testActual() {
        assertEquals(569_999, day6(parseFile("y2015/day06ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(1, day6Second(listOf("turn on 0,0 through 0,0")))
    }

    @Test
    fun test2Second() {
        assertEquals(2_000_000, day6Second(listOf("toggle 0,0 through 999,999")))
    }

    @Test
    fun testActualSecond() {
    assertEquals(17_836_115, day6Second(parseFile("y2015/day06ActualInput.txt")))
    }
}

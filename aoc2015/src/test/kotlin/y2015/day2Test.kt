package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.day2
import y2015.day2Second
import java.io.File

class day2Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(58, day2(listOf("2x3x4")))
    }

    @Test
    fun test2() {
        assertEquals(43, day2(listOf("1x1x10")))
    }

    @Test
    fun test3() {
        assertEquals(101, day2(listOf("1x1x10", "2x3x4")))
    }

    @Test
    fun testActual() {
        assertEquals(1586300, day2(parseFile("y2015/day02ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(34, day2Second(listOf("2x3x4")))
    }

    @Test
    fun test2Second() {
        assertEquals(14, day2Second(listOf("1x1x10")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(1783, day2Second(parseFile("y2015/day02ActualInput.txt")))
    }
}

package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day9Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(464, day9(listOf("London to Dublin = 464")))
    }

    @Test
    fun test2() {
        assertEquals(605, day9(listOf("London to Dublin = 464", "London to Belfast = 518", "Dublin to Belfast = 141")));
    }

    @Test
    fun testActual() {
        // 1111 too low
        assertEquals(141, day9(parseFile("y2015/day09ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(982, day9Second(listOf("London to Dublin = 464", "London to Belfast = 518", "Dublin to Belfast = 141")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(736, day9Second(parseFile("y2015/day09ActualInput.txt")))
    }
}


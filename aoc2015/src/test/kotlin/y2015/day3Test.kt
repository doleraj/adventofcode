package y2015.src.test.kotlin.y2015

import org.junit.Assert.*
import org.junit.Test
import y2015.day3
import y2015.day3Second
import java.io.File

class day3Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(2, day3(">"))
    }

    @Test
    fun test2() {
        assertEquals(4, day3("^>v<"))
    }

    @Test
    fun test3() {
        assertEquals(2, day3("^v^v^v^v^v"))
    }

    @Test
    fun testActual() {
        assertEquals(2592, day3(parseFile("y2015/day03ActualInput.txt")[0]))
    }

    @Test
    fun test1Second() {
        assertEquals(3, day3Second("^v"))
    }

    @Test
    fun test2Second() {
        assertEquals(3, day3Second("^>v<"))
    }

    @Test
    fun test3Second() {
        assertEquals(11, day3Second("^v^v^v^v^v"))
    }

    @Test
    fun testActualSecond() {
        assertEquals(2360, day3Second(parseFile("y2015/day03ActualInput.txt")[0]))
    }
}

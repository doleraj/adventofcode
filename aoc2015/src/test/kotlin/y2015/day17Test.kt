package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day17Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(4, day17(25, listOf("20", "15", "10", "5", "5")))
    }

    @Test
    fun testActual() {
        assertEquals(4372, day17(150, parseFile("y2015/day17ActualInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(4, day17Second(150, parseFile("y2015/day17ActualInput.txt")))
    }
}


package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day24Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(99, day24(listOf("1", "2", "3", "4", "5", "7", "8", "9", "10", "11").joinToString("\n")))
    }

    @Test
    fun testActual() {
        assertEquals(11846773891, day24(parseFile("y2015/day24ActualInput.txt").joinToString("\n")))
    }

    @Test
    fun test1Second() {
        assertEquals(44, day24Second(listOf("1", "2", "3", "4", "5", "7", "8", "9", "10", "11").joinToString("\n")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(80393059, day24Second(parseFile("y2015/day24ActualInput.txt").joinToString("\n")))
    }
}


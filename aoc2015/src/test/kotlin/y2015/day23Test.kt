package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day23Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(2, day23(listOf(
            "inc b",
            "jio b, +2",
            "tpl b",
            "inc b"
        ).joinToString("\n")))
    }

    @Test
    fun testActual() {
        assertEquals(255, day23(parseFile("y2015/day23ActualInput.txt").joinToString("\n")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(334, day23Second(parseFile("y2015/day23ActualInput.txt").joinToString("\n")))
    }
}


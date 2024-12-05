package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day16Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun testActual() {
        assertEquals(213, day16(parseFile("y2015/day16ActualInput.txt")))
    }

    @Test
    fun testActualSecond() {
        // 116 too low
        assertEquals(323, day16Second(parseFile("y2015/day16ActualInput.txt")))
    }
}


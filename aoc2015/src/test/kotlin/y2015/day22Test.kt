package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day22Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun testActual() {
        // 226 too low
        assertEquals(900, day22(parseFile("y2015/day22ActualInput.txt").joinToString("\n")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(1216, day22Second(parseFile("y2015/day22ActualInput.txt").joinToString("\n")))
    }
}


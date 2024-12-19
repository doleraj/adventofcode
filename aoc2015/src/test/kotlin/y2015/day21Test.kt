package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day21Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun testActual() {
        assertEquals(121, day21(parseFile("y2015/day21ActualInput.txt").joinToString("\n")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(201, day21Second(parseFile("y2015/day21ActualInput.txt").joinToString("\n")))
    }
}


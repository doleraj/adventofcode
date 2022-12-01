package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day8Test {
    fun parseFile(name: String): List<Int> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        return File(fileUri).readLines()[0].split(" ").map { s -> s.toInt() }
    }

    @Test
    fun test1() {
        assertEquals(138, day8(parseFile("y2018/day08TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(38567, day8(parseFile("y2018/day08ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(66, day8Second(parseFile("y2018/day08TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(24453, day8Second(parseFile("y2018/day08ActualInput.txt")))
    }
}
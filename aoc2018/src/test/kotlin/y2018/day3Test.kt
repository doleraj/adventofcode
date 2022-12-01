package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day3Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0) {""}
        File(fileUri).forEachLine { line -> lines.add(line)  }
        return lines.toTypedArray()
    }



    @Test
    fun test1() {
        assertEquals(4, day3(parseFile("y2018/day03TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(112418, day3(parseFile("y2018/day03ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(3, day3Second(parseFile("y2018/day03TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(560, day3Second(parseFile("y2018/day03ActualInput.txt")))
    }
}
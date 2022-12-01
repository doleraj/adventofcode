package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day4Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0) {""}
        File(fileUri).forEachLine { line -> lines.add(line)  }
        return lines.toTypedArray()
    }


    @Test
    fun test1() {
        assertEquals(240, day4(parseFile("y2018/day04TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(74743, day4(parseFile("y2018/day04ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(4455, day4Second(parseFile("y2018/day04TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(132484, day4Second(parseFile("y2018/day04ActualInput.txt")))
    }
}
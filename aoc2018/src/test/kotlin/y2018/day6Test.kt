package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day6Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0) {""}
        File(fileUri).forEachLine { line -> lines.add(line)  }
        return lines.toTypedArray()
    }

    @Test
    fun test1() {
        assertEquals(17, day6(parseFile("y2018/day06TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(3290, day6(parseFile("y2018/day06ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals(16, day6Second(32, parseFile("y2018/day06TestInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(45602, day6Second(10000, parseFile("y2018/day06ActualInput.txt")))
    }
}
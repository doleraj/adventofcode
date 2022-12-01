package y2018

import org.junit.Assert.*
import org.junit.Test
import java.io.File

class day5Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0) {""}
        File(fileUri).forEachLine { line -> lines.add(line)  }
        return lines.toTypedArray()
    }

    @Test
    fun test1() {
        assertEquals(0, day5("Aa"))
    }

    @Test
    fun test2() {
        assertEquals(0, day5("abBA"))
    }

    @Test
    fun test3() {
        assertEquals(4, day5("abAB"))
    }

    @Test
    fun test4() {
        assertEquals(6, day5("aabAAB"))
    }

    @Test
    fun test5() {
        assertEquals(10, day5("dabAcCaCBAcCcaDA"))
    }

    @Test
    fun testActual() {
        assertEquals(10132, day5(parseFile("y2018/day05ActualInput.txt")[0]))
    }

    @Test
    fun test1Second() {
        assertEquals(4, day5Second("dabAcCaCBAcCcaDA"))
    }

    @Test
    fun testActualSecond() {
        assertEquals(4572, day5Second(parseFile("y2018/day05ActualInput.txt")[0]))
    }
}